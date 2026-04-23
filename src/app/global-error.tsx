'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="fr">
      <body style={{ background: '#0A0A0A', color: '#F8F8F8', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }} aria-hidden="true">♚</div>
          <h1 style={{ fontSize: '4rem', color: '#CC0000', margin: '0 0 1rem', fontWeight: 'bold' }}>
            Erreur critique
          </h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>
            Une erreur grave est survenue. Veuillez réessayer.
          </p>
          <button
            onClick={unstable_retry}
            style={{ background: '#CC0000', color: '#fff', border: 'none', padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
