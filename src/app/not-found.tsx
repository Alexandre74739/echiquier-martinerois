import Link from 'next/link'

const pages = [
  { href: '/atelier', label: 'Atelier', piece: '♟' },
  { href: '/tournois', label: 'Tournois', piece: '♜' },
  { href: '/blog', label: 'Blog', piece: '♞' },
  { href: '/tarifs', label: 'Tarifs', piece: '♛' },
  { href: '/contact', label: 'Contact', piece: '♚' },
]

export default function NotFound() {
  return (
    <div className="min-h-screen bg-noir text-blanc flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">

        {/* Colonne gauche — visuel */}
        <div className="relative flex items-center justify-center bg-gris-fonce overflow-hidden px-8 py-20">
          <div className="absolute inset-0 chess-pattern opacity-[0.05]" aria-hidden="true" />
          <div className="relative text-center">
            <span
              className="block text-[10rem] leading-none select-none"
              style={{ transform: 'rotate(90deg)', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.6))' }}
              aria-hidden="true"
            >
              ♚
            </span>
            <div className="mt-6 w-16 h-1 bg-red mx-auto" />
            <p className="mt-4 font-display text-xl tracking-[0.3em] text-gris uppercase">
              Roi tombé
            </p>
          </div>
        </div>

        {/* Colonne droite — message + nav */}
        <div className="flex items-center px-8 py-20 lg:px-16">
          <div className="max-w-md w-full">
            <p className="font-display text-sm tracking-[0.3em] text-red uppercase mb-2">
              Erreur 404
            </p>
            <h1 className="font-display text-6xl sm:text-8xl leading-none text-blanc mb-4">
              Case<br />introuvable
            </h1>
            <p className="text-gris leading-relaxed mb-10">
              Cette page a quitté l'échiquier. Peut-être a-t-elle été déplacée
              ou n'a-t-elle jamais existé. Choisissez votre prochaine case.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-blanc px-8 py-4 font-display text-xl tracking-wider transition-colors mb-10"
            >
              <span aria-hidden="true">♞</span>
              Retour à l'accueil
            </Link>

            <div className="border-t border-gris-fonce pt-8">
              <p className="text-xs text-gris font-display tracking-widest uppercase mb-4">
                Pages disponibles
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pages.map(({ href, label, piece }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 text-gris hover:text-blanc text-sm py-2 px-3 border border-gris-fonce hover:border-gris transition-colors"
                  >
                    <span className="text-red" aria-hidden="true">{piece}</span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
