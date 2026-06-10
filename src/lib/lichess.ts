import { Chess } from 'chess.js'

export type LichessPuzzle = {
  id: string
  fen: string            // position après le dernier coup adversaire (joueur à jouer)
  moves: string[]        // [coup_joueur1, coup_adversaire1, coup_joueur2, …]
  opponentLastMove: string | null  // dernier coup adversaire en UCI (pour surbrillance)
  rating: number
  themes: string[]
}

export type NiveauPuzzle = 'débutant' | 'ado' | 'adulte'

const difficultyMap: Record<NiveauPuzzle, string> = {
  débutant: 'easiest',
  ado:      'normal',
  adulte:   'hardest',
}

const fallbackIds: Record<NiveauPuzzle, string[]> = {
  débutant: ['00008','0009l','000Qc','000vB','001jb','0020r','003Rc','003Si','003VT','004kY'],
  ado:      ['00GQ3','00I3U','00OBC','00Pzv','00RjM','00Rrz','00SCC','00Shi','00SxE','00T4q'],
  adulte:   ['00AhQ','00K3f','00L9h','00MBp','00MH0','00N0T','00Ohs','00PBO','00Qpq','00R1h'],
}

type LichessApiResponse = {
  puzzle: {
    id: string
    solution: string[]
    rating: number
    themes: string[]
    initialPly?: number
  }
  game: { pgn?: string }
}

function parseLichessResponse(data: LichessApiResponse): LichessPuzzle | null {
  try {
    const { puzzle, game } = data
    if (!puzzle?.solution?.length || puzzle.solution.length < 2) return null

    const pgn = game?.pgn ?? ''
    const ply = puzzle.initialPly ?? 0

    // chess.js loadPgn — parsing fiable, fini les regex fragiles + hacks ±1 ±2
    const fullGame = new Chess()
    try {
      fullGame.loadPgn(pgn)
    } catch {
      return null
    }
    const sanMoves = fullGame.history()

    // initialPly = index 0-based du DERNIER coup adversaire dans le PGN
    // → rejouer ply+1 coups pour obtenir la position puzzle (joueur à jouer)
    const board = new Chess()
    let opponentLastMove: string | null = null
    const count = Math.min(ply + 1, sanMoves.length)
    for (let i = 0; i < count; i++) {
      const m = board.move(sanMoves[i])
      if (i === count - 1 && m) {
        opponentLastMove = m.from + m.to + (m.promotion ?? '')
      }
    }
    const fen = board.fen()

    // Vérifier que solution[0] (premier coup du joueur) est légal depuis ce FEN
    const first = puzzle.solution[0]
    const test = new Chess(fen)
    try {
      test.move({
        from: first.slice(0, 2),
        to: first.slice(2, 4),
        promotion: (first[4] as 'q') ?? undefined,
      })
    } catch {
      return null
    }

    return {
      id: puzzle.id,
      fen,
      moves: puzzle.solution,
      opponentLastMove,
      rating: puzzle.rating ?? 1500,
      themes: puzzle.themes ?? [],
    }
  } catch {
    return null
  }
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
  // 1. Essai avec filtre de difficulté
  try {
    const res = await fetch(
      `https://lichess.org/api/puzzle/next?difficulty=${difficultyMap[niveau]}`,
      { headers: { Accept: 'application/json' }, cache: 'no-store' },
    )
    if (res.ok) {
      const puzzle = parseLichessResponse(await res.json())
      if (puzzle) return puzzle
    }
  } catch { /* ignore */ }

  // 2. Puzzle aléatoire sans filtre
  try {
    const res = await fetch(
      'https://lichess.org/api/puzzle/next',
      { headers: { Accept: 'application/json' }, cache: 'no-store' },
    )
    if (res.ok) {
      const puzzle = parseLichessResponse(await res.json())
      if (puzzle) return puzzle
    }
  } catch { /* ignore */ }

  // 3. IDs de secours en dur
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

export function niveauLabel(niveau: NiveauPuzzle): string {
  return {
    débutant: 'Débutant (< 1200)',
    ado:      'Adolescent (1200–1600)',
    adulte:   'Adulte (> 1600)',
  }[niveau]
}
