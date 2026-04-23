import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
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
    if (auth !== expected) {
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
