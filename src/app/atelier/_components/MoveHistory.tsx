type Props = { moves: string[] }

export function MoveHistory({ moves }: Props) {
  if (moves.length === 0) return null
  return (
    <div className="w-full max-w-120 bg-gris-clair p-3">
      <p className="text-xs text-gris mb-2 font-display tracking-wider">Historique</p>
      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto text-xs font-mono">
        {moves.map((move, i) => (
          <span key={i}>
            {i % 2 === 0 && (
              <span className="text-red mr-0.5">{Math.floor(i / 2) + 1}.</span>
            )}
            <span className={i % 2 === 0 ? 'text-noir' : 'text-gris'}>{move} </span>
          </span>
        ))}
      </div>
    </div>
  )
}
