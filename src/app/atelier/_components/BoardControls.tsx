type Props = {
  onReset: () => void
  onUndo: () => void
  onFlip: () => void
  canUndo: boolean
}

export function BoardControls({ onReset, onUndo, onFlip, canUndo }: Props) {
  const btn = 'flex-1 min-w-20 py-3 font-display tracking-wider transition-colors text-sm'
  return (
    <div className="flex gap-3 flex-wrap justify-center w-full max-w-120">
      <button onClick={onReset} className={`${btn} bg-noir hover:bg-gris-fonce text-blanc`}>
        ↺ Réinitialiser
      </button>
      <button onClick={onUndo} disabled={!canUndo} className={`${btn} border border-gris hover:border-blanc text-gris hover:text-blanc disabled:opacity-40`}>
        ← Annuler
      </button>
      <button onClick={onFlip} className={`${btn} border border-gris hover:border-blanc text-gris hover:text-blanc`}>
        ⇅ Retourner
      </button>
    </div>
  )
}
