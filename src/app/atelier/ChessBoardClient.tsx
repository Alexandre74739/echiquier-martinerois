'use client'

import { useState, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { boardOptions } from './_components/boardOptions'
import { BoardControls } from './_components/BoardControls'
import { MoveHistory } from './_components/MoveHistory'

export function ChessBoardClient() {
  const [game, setGame] = useState(() => new Chess())
  const [orientation, setOrientation] = useState<'white' | 'black'>('white')
  const [message, setMessage] = useState('')

  const makeMove = useCallback((move: { from: string; to: string }) => {
    const copy = new Chess(game.fen())
    try {
      const result = copy.move({ ...move, promotion: 'q' })
      if (!result) return false
      setGame(copy)
      if (copy.isCheckmate()) setMessage('Échec et mat !')
      else if (copy.isCheck()) setMessage('Échec !')
      else if (copy.isDraw()) setMessage('Nulle !')
      else setMessage('')
      return true
    } catch { return false }
  }, [game])

  const reset = () => { setGame(new Chess()); setMessage('') }
  const undo  = () => { const g = new Chess(game.fen()); g.undo(); setGame(g); setMessage('') }
  const flip  = () => setOrientation((o) => o === 'white' ? 'black' : 'white')

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-120">
        <Chessboard
          options={{
            ...boardOptions,
            position: game.fen(),
            boardOrientation: orientation,
            onPieceDrop: ({ sourceSquare: from, targetSquare: to }) =>
              from && to ? makeMove({ from, to }) : false,
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
