type Props = {
  value: string
  onChange: (v: string) => void
  onLoad: () => void
}

export function FenInput({ value, onChange, onLoad }: Props) {
  return (
    <div className="w-full max-w-120">
      <label className="block text-xs text-gris mb-1 font-display tracking-wider">Position (FEN)</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLoad()}
          className="flex-1 bg-gris-fonce text-blanc text-xs px-3 py-2 border border-gris focus:border-red outline-none font-mono"
          placeholder="FEN..."
        />
        <button onClick={onLoad} className="bg-red hover:bg-red-hover text-blanc px-3 py-2 font-display text-sm transition-colors">
          Charger
        </button>
      </div>
    </div>
  )
}
