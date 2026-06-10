'use client'

import { useState, useCallback, useMemo } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { boardOptions } from './_components/boardOptions'
import { BoardControls } from './_components/BoardControls'
import { MoveHistory } from './_components/MoveHistory'

export function ChessBoardClient() {
  const [game, setGame] = useState(() => new Chess())
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [message, setMessage] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const makeMove = useCallback((from: string, to: string): boolean => {
    const copy = new Chess(game.fen())
    try {
      const result = copy.move({ from, to, promotion: 'q' })
      if (!result) return false
      setGame(copy)
      setSelected(null)
      if (copy.isCheckmate()) setMessage('Échec et mat !')
      else if (copy.isCheck()) setMessage('Échec !')
      else if (copy.isDraw()) setMessage('Nulle !')
      else setMessage('')
      return true
    } catch { return false }
  }, [game])

  const onSquareClick = useCallback(({ square, piece }: { square: string; piece: { pieceType: string } | null }) => {
    if (selected) {
      if (selected === square) { setSelected(null); return }
      if (makeMove(selected, square)) return
      // reselect si c'est une pièce qui peut se déplacer
      if (piece && game.moves({ square: square as never, verbose: true }).length > 0) {
        setSelected(square)
      } else {
        setSelected(null)
      }
    } else if (piece && game.moves({ square: square as never, verbose: true }).length > 0) {
      setSelected(square)
    }
  }, [selected, game, makeMove])

  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {}
    if (!selected) return styles
    styles[selected] = { backgroundColor: 'rgba(30,120,255,0.5)' }
    const dests = game.moves({ square: selected as never, verbose: true })
    for (const m of dests) {
      const hasPiece = !!game.get(m.to as never)
      styles[m.to] = hasPiece
        ? { backgroundColor: 'rgba(30,120,255,0.15)', outline: '3px solid rgba(30,120,255,0.5)', outlineOffset: '-3px' }
        : { background: 'radial-gradient(circle, rgba(30,120,255,0.45) 28%, transparent 28%)' }
    }
    return styles
  }, [selected, game])

  const reset = () => { setGame(new Chess()); setMessage(''); setSelected(null) }
  const undo  = () => {
    const g = new Chess(game.fen()); g.undo(); setGame(g); setMessage(''); setSelected(null)
  }
  const flip  = () => setOrientation((o) => o === 'white' ? 'black' : 'white')

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-120">
        <Chessboard
          options={{
            ...boardOptions,
            position: game.fen(),
            boardOrientation: orientation,
            squareStyles,
            onSquareClick,
            onPieceDrop: ({ sourceSquare: from, targetSquare: to }) =>
              from && to ? makeMove(from, to) : false,
          }}
        />
      </div>

      {message && (
        <div className="bg-red text-blanc font-display text-xl tracking-wider px-6 py-3 w-full max-w-120 text-center">
          {message}
        </div>
      )}

      <BoardControls onReset={reset} onUndo={undo} onFlip={flip} canUndo={game.history().length > 0} />
      <MoveHistory moves={game.history()} />
    </div>
  )
}
