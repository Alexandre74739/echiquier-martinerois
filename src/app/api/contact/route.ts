import { type NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* Rate limiting en mémoire (par IP, 5 req/min).
   Dans un environnement serverless, la Map est par instance — c'est la limite
   acceptable sans infrastructure Redis. */
const rl = new Map<string, { n: number; resetAt: number }>()

function isAllowed(ip: string): boolean {
  const now = Date.now()
  const e = rl.get(ip)
  if (!e || now > e.resetAt) {
    rl.set(ip, { n: 1, resetAt: now + 60_000 })
    return true
  }
  if (e.n >= 5) return false
  e.n++
  return true
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!isAllowed(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez patienter une minute avant de réessayer.' },
      { status: 429 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const { nom, email, sujet, message, honeypot } = body as Record<string, string>

  /* Honeypot : si un bot a rempli le champ caché, on feint le succès */
  if (honeypot) return NextResponse.json({ success: true })

  /* Validation serveur */
  if (!nom?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: 'Champs obligatoires manquants.' },
      { status: 400 },
    )
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'Adresse email invalide.' },
      { status: 400 },
    )
  }
  if (nom.length > 100 || message.length > 5000 || (sujet?.length ?? 0) > 200) {
    return NextResponse.json(
      { error: 'Données trop longues.' },
      { status: 400 },
    )
  }

  const serviceId  = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY  // requis si "Use Private Key" est coché

  if (!serviceId || !templateId || !publicKey) {
    console.error('[contact] Variables EmailJS manquantes côté serveur')
    return NextResponse.json(
      { error: 'Service email non configuré.' },
      { status: 503 },
    )
  }

  try {
    const payload: Record<string, unknown> = {
      service_id:      serviceId,
      template_id:     templateId,
      user_id:         publicKey,
      template_params: {
        from_name:  nom.trim(),
        from_email: email.trim(),
        subject:    sujet?.trim() || 'Contact site web',
        message:    message.trim(),
      },
    }
    /* accessToken obligatoire quand "Use Private Key" est activé sur EmailJS */
    if (privateKey) payload.accessToken = privateKey

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '(impossible de lire la réponse)')
      console.error(`[contact] EmailJS ${res.status}: ${body}`)
      return NextResponse.json(
        { error: "L'envoi a échoué. Veuillez réessayer.", detail: body },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "L'envoi a échoué. Veuillez réessayer ou nous contacter directement par email." },
      { status: 502 },
    )
  }
}
