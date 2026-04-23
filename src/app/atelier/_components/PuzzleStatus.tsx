type Status = 'playing' | 'correct' | 'wrong' | 'solved'

const messages: Record<Status, { text: string; bg: string }> = {
  playing: { text: 'À vous de jouer !', bg: 'bg-noir' },
  correct: { text: '✓ Bon coup — continuez !', bg: 'bg-green-700' },
  wrong:   { text: '✗ Coup incorrect — réessayez', bg: 'bg-red' },
  solved:  { text: '♛ Puzzle résolu !', bg: 'bg-green-700' },
}

export function PuzzleStatus({ status }: { status: Status }) {
  const { text, bg } = messages[status]
  return (
    <div className={`w-full max-w-[480px] text-blanc font-display text-lg tracking-wider px-6 py-3 text-center ${bg}`}>
      {text}
    </div>
  )
}
