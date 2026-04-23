/* ⚠ Règle clé : le centrage est sur le WRAPPER, l'animation est sur l'ENFANT.
   Les deux ne peuvent pas être sur le même élément car les keyframes
   écrasent le transform des classes Tailwind. */
export default function Loading() {
  const dur = '3.2s ease-in-out infinite'

  return (
    <div className="min-h-[60vh] bg-noir flex flex-col items-center justify-center gap-8">
      {/* Scène — largeur fixe pour ancrer les positions */}
      <div className="relative" style={{ width: 160, height: 96 }}>
        {/* Ombre au sol (sous le pion) */}
        <div
          className="absolute rounded-full bg-red/20"
          style={{ width: 40, height: 8, bottom: 0, left: 60, animation: `pawn-ground ${dur}` }}
        />

        {/* Wrapper centrage pion — PAS animé */}
        <div className="absolute" style={{ bottom: 12, left: 60 }}>
          {/* Pion — SEUL élément animé, pas de transform de classe */}
          <span
            className="block text-6xl text-blanc select-none leading-none"
            style={{ animation: `pawn-bounce ${dur}` }}
            aria-hidden="true"
          >♙</span>
        </div>

        {/* Wrapper centrage cavalier — PAS animé */}
        <div className="absolute" style={{ bottom: 8, left: 56 }}>
          {/* Cavalier — part de translateX(88px), arrive à 0 */}
          <span
            className="block text-7xl text-red select-none leading-none"
            style={{ animation: `knight-slide ${dur}` }}
            aria-hidden="true"
          >♞</span>
        </div>
      </div>

      <p className="font-display text-2xl text-blanc tracking-[0.3em] animate-pulse">
        Chargement…
      </p>
    </div>
  )
}
