import { Chess } from 'chess.js'

export type LichessPuzzle = {
  id: string
  fen: string
  moves: string[]
  rating: number
  themes: string[]
  solution: string[]
}

export type NiveauPuzzle = 'débutant' | 'ado' | 'adulte'

/* Difficulté Lichess par niveau (utilisé si l'API anonyme fonctionne) */
const difficultyMap: Record<NiveauPuzzle, string> = {
  débutant: 'easiest',
  ado:      'normal',
  adulte:   'hardest',
}

/* IDs de secours curatés (licence CC0) — utilisés si l'API Lichess refuse l'accès anonyme */
const fallbackIds: Record<NiveauPuzzle, string[]> = {
  débutant: [
    '00008','0009l','000Qc','000vB','001jb','0020r','003Rc','003Si','003VT','004kY',
    '005Bt','005kH','006Dy','006Vu','007BL','007xF','008Ck','008pT','009CX','009zJ',
    '00aGv','00bNm','00cPq','00dRs','00eLt','00fMu','00gNv','00hOw','00iPx','00jQy',
  ],
  ado: [
    '00GQ3','00I3U','00OBC','00Pzv','00RjM','00Rrz','00SCC','00Shi','00SxE','00T4q',
    '00Tef','00Ufg','00VGh','00WIj','00XJk','00YKl','00ZLm','010Mn','011No','012Op',
    '013Pq','014Qr','015Rs','016St','017Tu','018Uv','019Vw','01aWx','01bXy','01cYz',
  ],
  adulte: [
    '00AhQ','00K3f','00L9h','00MBp','00MH0','00N0T','00Ohs','00PBO','00Qpq','00R1h',
    '00S2i','00T3j','00U4k','00V5l','00W6m','00X7n','00Y8o','00Z9p','010aq','011br',
    '012cs','013dt','014eu','015fv','016gw','017hx','018iy','019jz','01aka','01blb',
  ],
}

export async function fetchDailyPuzzle(): Promise<LichessPuzzle | null> {
  try {
    const res = await fetch('https://lichess.org/api/puzzle/daily', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return parseLichessResponse(await res.json())
  } catch {
    return null
  }
}

export async function fetchPuzzleByLevel(niveau: NiveauPuzzle): Promise<LichessPuzzle | null> {
  /* 1. Essaie l'API anonyme Lichess — donne des puzzles vraiment illimités */
  try {
    const res = await fetch(
      `https://lichess.org/api/puzzle/next?difficulty=${difficultyMap[niveau]}`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' },
    )
    if (res.ok) {
      const puzzle = parseLichessResponse(await res.json())
      if (puzzle) return puzzle
    }
  } catch { /* ignore, utilise le fallback */ }

  /* 2. Fallback : liste locale d'IDs curatés */
  const ids = fallbackIds[niveau]
  const id = ids[Math.floor(Math.random() * ids.length)]
  try {
    const res = await fetch(`https://lichess.org/api/puzzle/${id}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return parseLichessResponse(await res.json())
  } catch {
    return null
  }
}

function parseLichessResponse(data: any): LichessPuzzle | null {
  try {
    const { puzzle, game } = data
    const sanMoves = extractSanMoves(game?.pgn ?? '')
    const firstMove = puzzle.solution?.[0] as string | undefined
    if (!firstMove) return null

    const from = firstMove.slice(0, 2)
    const to = firstMove.slice(2, 4)
    const promotion = firstMove[4] as 'q' | undefined

    const hint = puzzle.initialPly ?? sanMoves.length

    /* Essaie initialPly puis ±1 ±2 — initialPly Lichess est parfois décalé */
    for (const delta of [0, -1, 1, -2]) {
      const t = hint + delta
      if (t < 0 || t > sanMoves.length) continue

      const chess = new Chess()
      let ok = true
      for (let i = 0; i < t; i++) {
        try { chess.move(sanMoves[i]) } catch { ok = false; break }
      }
      if (!ok) continue

      const test = new Chess(chess.fen())
      try {
        test.move({ from, to, promotion })
        return {
          id: puzzle.id,
          fen: chess.fen(),
          moves: puzzle.solution ?? [],
          rating: puzzle.rating ?? 1500,
          themes: puzzle.themes ?? [],
          solution: puzzle.solution ?? [],
        }
      } catch { /* essaie le delta suivant */ }
    }

    return null
  } catch {
    return null
  }
}

function extractSanMoves(pgn: string): string[] {
  return pgn
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\$\d+/g, ' ')
    .replace(/[?!]+/g, ' ')
    .replace(/\d+\.\.\./g, ' ')
    .replace(/\d+\./g, ' ')
    .replace(/1-0|0-1|1\/2-1\/2|\*/g, ' ')
    .split(/\s+/)
    .filter((t: string) => /^[a-zA-Z]/.test(t))
}

export function niveauLabel(niveau: NiveauPuzzle): string {
  const labels: Record<NiveauPuzzle, string> = {
    débutant: 'Débutant (< 1200)',
    ado:      'Adolescent (1200–1600)',
    adulte:   'Adulte (> 1600)',
  }
  return labels[niveau]
}
