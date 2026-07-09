import { NextResponse } from 'next/server'
import sitemap from '@/src/app/sitemap'
import { submitToIndexNow } from '@/src/lib/indexnow'

export const dynamic = 'force-dynamic'

/* Déclenché par le cron Vercel (voir vercel.json) ou manuellement,
   avec l'en-tête Authorization: Bearer <CRON_SECRET>. */
export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })
  }

  const urls = (await sitemap()).map((entry) => entry.url)
  const success = await submitToIndexNow(urls)

  return NextResponse.json({ success, count: urls.length })
}
