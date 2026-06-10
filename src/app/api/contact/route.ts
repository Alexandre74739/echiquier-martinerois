import { type NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://echiquier-martinerois.fr',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
]

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

type ContactBody = {
  nom?: string
  email?: string
  sujet?: string
  message?: string
  honeypot?: string
}

type EmailJSTemplateParams = {
  from_name: string
  from_email: string
  subject: string
  message: string
}

type EmailJSPayload = {
  service_id: string
  template_id: string
  user_id: string
  template_params: EmailJSTemplateParams
  accessToken?: string
}

export async function POST(request: NextRequest) {
  /* Validation de l'origine pour bloquer les requêtes cross-site */
  const origin = request.headers.get('origin')
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: 'Origine non autorisée.' }, { status: 403 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!isAllowed(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez patienter une minute avant de réessayer.' },
      { status: 429 },
    )
  }

  let body: ContactBody
  try {
    body = await request.json() as ContactBody
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const { nom, email, sujet, message, honeypot } = body

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
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  if (!serviceId || !templateId || !publicKey) {
    console.error('[contact] Variables EmailJS manquantes côté serveur')
    return NextResponse.json(
      { error: 'Service email non configuré.' },
      { status: 503 },
    )
  }

  try {
    const payload: EmailJSPayload = {
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
      const text = await res.text().catch(() => '(impossible de lire la réponse)')
      console.error(`[contact] EmailJS ${res.status}: ${text}`)
      return NextResponse.json(
        { error: "L'envoi a échoué. Veuillez réessayer." },
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
