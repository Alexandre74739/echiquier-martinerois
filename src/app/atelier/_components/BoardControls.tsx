type Props = {
  onReset: () => void
  onUndo: () => void
  onFlip: () => void
  canUndo: boolean
}

export function BoardControls({ onReset, onUndo, onFlip, canUndo }: Props) {
  return (
    <div className="flex gap-2 w-full max-w-120">
      <button
        onClick={onReset}
        className="cursor-pointer flex-1 py-3 bg-noir hover:bg-gris-fonce text-blanc font-display tracking-wider text-sm transition-colors"
      >
        ↺ Réinitialiser
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="cursor-pointer flex-1 py-3 bg-gris-clair hover:bg-gris hover:text-blanc text-noir font-display tracking-wider text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Annuler
      </button>
      <button
        onClick={onFlip}
        className="cursor-pointer flex-1 py-3 bg-gris-clair hover:bg-gris hover:text-blanc text-noir font-display tracking-wider text-sm transition-colors"
      >
        ⇅ Retourner
      </button>
    </div>
  )
}
