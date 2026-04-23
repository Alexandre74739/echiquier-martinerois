type Analyse = {
  depth: number; score: number | null; mate: number | null
  bestMove: string; pv: string; lines: string[]
}

type Props = {
  analyse: Analyse | null
  analysing: boolean
  depth: number
  turn: 'w' | 'b'
  onDepthChange: (d: number) => void
  onToggle: () => void
}

function scoreDisplay(a: Analyse) {
  if (a.mate !== null) return a.mate > 0 ? `Mat en ${a.mate}` : `Mat en ${-a.mate} (adv.)`
  if (a.score !== null) return a.score > 0 ? `+${a.score.toFixed(2)}` : a.score.toFixed(2)
  return '—'
}
function scoreColor(a: Analyse) {
  if (a.mate !== null) return a.mate > 0 ? 'text-green-400' : 'text-red'
  const s = a.score ?? 0
  return s > 0.5 ? 'text-green-400' : s < -0.5 ? 'text-red' : 'text-blanc'
}

export function AnalysisPanel({ analyse, analysing, depth, turn, onDepthChange, onToggle }: Props) {
  return (
    <div className="flex-1 bg-noir text-blanc p-6 flex flex-col gap-5">
      <h3 className="font-display text-3xl text-red tracking-wider">Analyse Stockfish</h3>

      <div>
        <label className="text-xs text-gris font-display tracking-wider block mb-2">
          Profondeur : <strong className="text-blanc">{depth}</strong>
        </label>
        <input type="range" min={5} max={25} value={depth} onChange={(e) => onDepthChange(+e.target.value)} className="w-full accent-red" />
        <div className="flex justify-between text-xs text-gris mt-1"><span>Rapide (5)</span><span>Approfondi (25)</span></div>
      </div>

      <button onClick={onToggle} className={`py-4 font-display text-xl tracking-wider transition-colors ${analysing ? 'bg-gris-fonce hover:bg-gris text-blanc' : 'bg-red hover:bg-red-hover text-blanc'}`}>
        {analysing ? "⏹ Arrêter l'analyse" : '▶ Analyser la position'}
      </button>

      {analysing && (
        <div className="flex items-center gap-3 text-gris">
          <span className="text-red text-2xl animate-spin" aria-hidden="true">♞</span>
          <span className="text-sm font-display tracking-wider">Analyse en cours…</span>
        </div>
      )}

      {analyse && (
        <div className="space-y-3">
          <div className="bg-gris-fonce p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gris font-display tracking-wider">Évaluation</span>
              <span className="text-xs text-gris">Prof. {analyse.depth}</span>
            </div>
            <div className={`font-display text-4xl ${scoreColor(analyse)}`}>{scoreDisplay(analyse)}</div>
            {analyse.score !== null && (
              <div className="mt-2 h-2 bg-gris rounded-full overflow-hidden">
                <div className="h-full bg-blanc transition-all" style={{ width: `${Math.min(100, Math.max(0, 50 + (analyse.score ?? 0) * 10))}%` }} />
              </div>
            )}
          </div>

          {analyse.bestMove && (
            <div className="bg-gris-fonce p-4">
              <p className="text-xs text-gris font-display tracking-wider mb-1">Meilleur coup</p>
              <p className="font-display text-2xl text-red">{analyse.bestMove}</p>
              {analyse.pv && <p className="text-xs text-gris mt-2 font-mono break-all line-clamp-3">{analyse.pv}</p>}
            </div>
          )}

          <div className="bg-gris-fonce p-3 text-sm flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border-2 border-gris ${turn === 'w' ? 'bg-blanc' : 'bg-noir'}`} />
            <span className="text-gris">Trait aux <strong className="text-blanc">{turn === 'w' ? 'Blancs' : 'Noirs'}</strong></span>
          </div>
        </div>
      )}

      <p className="text-xs text-gris mt-auto pt-4 border-t border-gris-fonce">
        Stockfish 18 — fonctionne dans votre navigateur, aucune donnée envoyée.
      </p>
    </div>
  )
}
