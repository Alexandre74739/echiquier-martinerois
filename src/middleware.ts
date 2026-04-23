import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Comparaison résistante aux timing attacks via SHA-256 (Web Crypto, compatible Edge Runtime).
 * Hacher les deux valeurs les ramène à une longueur identique avant la comparaison XOR.
 */
async function safeCompare(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  const ua = new Uint8Array(ha)
  const ub = new Uint8Array(hb)
  let diff = 0
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i]
  return diff === 0
}

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/studio')) {
    return NextResponse.next()
  }

  const devKey = process.env.STUDIO_DEV_KEY

  /* En développement sans clé configurée : accès libre */
  if (process.env.NODE_ENV !== 'production' && !devKey) {
    return NextResponse.next()
  }

  /* En production (ou si STUDIO_DEV_KEY est défini) : authentification HTTP Basic */
  if (devKey) {
    const auth = req.headers.get('authorization') ?? ''
    const expected = 'Basic ' + Buffer.from(`dev:${devKey}`).toString('base64')

    if (!(await safeCompare(auth, expected))) {
      return new NextResponse('Accès refusé', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Studio"' },
      })
    }
    return NextResponse.next()
  }

  /* Production sans clé : studio complètement masqué */
  return new NextResponse(null, { status: 404 })
}

export const config = {
  matcher: '/studio/:path*',
}
