import Link from 'next/link'

export function SectionCTA() {
  return (
    <section className="bg-blanc py-24 relative overflow-hidden">
      <span
        className="absolute right-0 bottom-0 text-[20rem] leading-none text-noir/[0.04] select-none pointer-events-none translate-x-1/4 translate-y-1/4"
        aria-hidden="true"
      >
        ♔
      </span>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-noir px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase mb-6">
          Premier cours gratuit
        </span>
        <h2 className="font-display text-5xl sm:text-7xl text-noir mb-4 leading-none">
          Prêt à<br /><span className="text-red">jouer ?</span>
        </h2>
        <p className="text-gris mb-10 text-lg max-w-xl mx-auto leading-relaxed">
          Rejoignez l'Échiquier Martinérois à Saint-Martin-d'Hères.<br />
          Tous les niveaux acceptés : enfants, ados, adultes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/contact" className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-blanc px-10 py-4 font-display text-2xl tracking-wider transition-colors">
            <span aria-hidden="true">♞</span>Nous contacter
          </Link>
          <Link href="/tarifs" className="inline-flex items-center gap-3 bg-noir hover:bg-gris-fonce text-blanc px-10 py-4 font-display text-2xl tracking-wider transition-colors">
            <span aria-hidden="true">♟</span>Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  )
}
