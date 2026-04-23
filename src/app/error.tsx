'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] bg-noir text-blanc flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Pièces en désordre */}
        <div className="flex justify-center gap-3 mb-6 text-4xl" aria-hidden="true">
          {['♜', '♞', '♝', '♛'].map((piece, i) => (
            <span
              key={i}
              className="text-gris-fonce"
              style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (15 + i * 8)}deg)` }}
            >
              {piece}
            </span>
          ))}
        </div>

        <h1 className="font-display text-7xl sm:text-9xl text-red leading-none mb-2">
          Erreur
        </h1>

        <div className="flex items-center justify-center gap-4 my-4">
          <div className="h-px flex-1 bg-gris-fonce max-w-24" />
          <span className="text-red text-xl" aria-hidden="true">♟</span>
          <div className="h-px flex-1 bg-gris-fonce max-w-24" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl tracking-wider text-blanc mb-4">
          Le jeu est interrompu
        </h2>
        <p className="text-gris mb-8 leading-relaxed">
          Une erreur inattendue a interrompu la partie. Vous pouvez essayer de rejouer
          ou retourner à l'accueil.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={unstable_retry}
            className="flex items-center gap-2 bg-red hover:bg-red-hover text-blanc px-6 py-3 font-display text-lg tracking-wider transition-colors"
          >
            <span aria-hidden="true">↺</span>
            Réessayer
          </button>
          <a
            href="/"
            className="flex items-center gap-2 border border-gris text-gris hover:border-blanc hover:text-blanc px-6 py-3 font-display text-lg tracking-wider transition-colors"
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  )
}
