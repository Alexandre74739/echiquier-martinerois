import { type NextRequest, NextResponse } from 'next/server'
import {
  fetchPuzzleByLevel,
  fetchDailyPuzzle,
  type NiveauPuzzle,
} from '@/src/lib/lichess'

const NIVEAUX_VALIDES: NiveauPuzzle[] = ['débutant', 'ado', 'adulte']

/* Rate limiting en mémoire (30 req/min par IP) */
const rl = new Map<string, { n: number; resetAt: number }>()

function isAllowed(ip: string): boolean {
  const now = Date.now()
  const e = rl.get(ip)
  if (!e || now > e.resetAt) {
    rl.set(ip, { n: 1, resetAt: now + 60_000 })
    return true
  }
  if (e.n >= 30) return false
  e.n++
  return true
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!isAllowed(ip)) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Veuillez patienter.' },
      { status: 429 },
    )
  }

  const { searchParams } = new URL(request.url)
  const niveauParam = searchParams.get('niveau')
  const daily = searchParams.get('daily') === '1'

  /* Validation runtime du paramètre niveau */
  if (niveauParam && !NIVEAUX_VALIDES.includes(niveauParam as NiveauPuzzle)) {
    return NextResponse.json(
      { error: `Niveau invalide. Valeurs acceptées : ${NIVEAUX_VALIDES.join(', ')}` },
      { status: 400 },
    )
  }

  const niveau = (niveauParam as NiveauPuzzle) ?? 'débutant'

  const puzzle = daily
    ? await fetchDailyPuzzle()
    : await fetchPuzzleByLevel(niveau)

  if (!puzzle) {
    return NextResponse.json({ puzzle: null }, { status: 502 })
  }

  return NextResponse.json(
    { puzzle },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
