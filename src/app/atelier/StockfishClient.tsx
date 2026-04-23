'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { boardOptions } from './_components/boardOptions'
import { FenInput } from './_components/FenInput'
import { AnalysisPanel } from './_components/AnalysisPanel'

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

type Analyse = { depth: number; score: number | null; mate: number | null; bestMove: string; pv: string; lines: string[] }

export function StockfishClient() {
  const [game, setGame] = useState(() => new Chess())
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [analyse, setAnalyse] = useState<Analyse | null>(null)
  const [analysing, setAnalysing] = useState(false)
  const [depth, setDepth] = useState(15)
  const [fenInput, setFenInput] = useState(START_FEN)
  const workerRef = useRef<Worker | null>(null)
  const ref = useRef<Partial<Analyse>>({})

  useEffect(() => {
    const w = new Worker('/stockfish.js')
    workerRef.current = w
    w.postMessage('uci')
    w.postMessage('isready')
    w.onmessage = ({ data }: MessageEvent) => {
      const line: string = typeof data === 'string' ? data : String(data)
      if (line.startsWith('info depth')) {
        const d = line.match(/depth (\d+)/);   if (d) ref.current.depth = +d[1]
        const cp = line.match(/score cp (-?\d+)/); if (cp) { ref.current.score = +cp[1] / 100; ref.current.mate = null }
        const mt = line.match(/score mate (-?\d+)/); if (mt) { ref.current.mate = +mt[1]; ref.current.score = null }
        const pv = line.match(/ pv (.+)/);    if (pv) ref.current.pv = pv[1]
        if (d && +d[1] >= depth - 2) setAnalyse({ ...ref.current, lines: [] } as Analyse)
      }
      if (line.startsWith('bestmove')) {
        const m = line.match(/bestmove (\S+)/)
        if (m) { ref.current.bestMove = m[1]; setAnalyse({ ...ref.current, lines: [] } as Analyse); setAnalysing(false) }
      }
    }
    return () => w.terminate()
  }, [depth])

  const startAnalysis = useCallback(() => {
    if (!workerRef.current) return
    setAnalysing(true); ref.current = {}
    workerRef.current.postMessage('stop')
    workerRef.current.postMessage(`position fen ${game.fen()}`)
    workerRef.current.postMessage(`go depth ${depth}`)
  }, [game, depth])

  const stopAnalysis = useCallback(() => { workerRef.current?.postMessage('stop'); setAnalysing(false) }, [])

  const makeMove = useCallback(({ sourceSquare: from, targetSquare: to }: { sourceSquare: string | null; targetSquare: string | null }) => {
    if (!from || !to) return false
    const g = new Chess(game.fen())
    try {
      if (!g.move({ from, to, promotion: 'q' })) return false
      setGame(g); setAnalyse(null); return true
    } catch { return false }
  }, [game])

  const loadFen = () => {
    try { const g = new Chess(fenInput.trim()); setGame(g); setAnalyse(null) }
    catch { alert('FEN invalide.') }
  }

  const reset = () => { setGame(new Chess()); setAnalyse(null); setFenInput(START_FEN) }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex flex-col items-center gap-4 shrink-0">
        <div className="w-full max-w-120">
          <Chessboard options={{ ...boardOptions, position: game.fen(), boardOrientation: orientation, onPieceDrop: makeMove }} />
        </div>
        <div className="flex gap-2 w-full max-w-120">
          <button onClick={reset} className="flex-1 bg-noir hover:bg-gris-fonce text-blanc py-2 font-display text-sm tracking-wider transition-colors">↺ Réinitialiser</button>
          <button onClick={() => setOrientation((o) => o === 'white' ? 'black' : 'white')} className="flex-1 border border-gris hover:border-blanc text-gris hover:text-blanc py-2 font-display text-sm tracking-wider transition-colors">⇅ Retourner</button>
        </div>
        <FenInput value={fenInput} onChange={setFenInput} onLoad={loadFen} />
      </div>

      <AnalysisPanel
        analyse={analyse}
        analysing={analysing}
        depth={depth}
        turn={game.turn()}
        onDepthChange={setDepth}
        onToggle={analysing ? stopAnalysis : startAnalysis}
      />
    </div>
  )
}
