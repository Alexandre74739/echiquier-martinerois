import Link from 'next/link'

type Props = {
  categorie: string
  tranche: string
  prix: string
  avantages: string[]
  featured?: boolean
  badge?: string
}

export function PricingCard({ categorie, tranche, prix, avantages, featured = false, badge }: Props) {
  return (
    <div className={`relative flex flex-col border-t-4 p-8 shadow-sm transition-shadow hover:shadow-xl
      ${featured
        ? 'border-red bg-noir text-blanc -mt-4 -mb-4 z-10'
        : 'border-gris-clair bg-blanc text-noir'
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red text-blanc px-4 py-1 font-display text-xs tracking-[0.2em] uppercase whitespace-nowrap">
          {badge}
        </div>
      )}

      <div className="mb-6">
        <p className={`text-xs font-display tracking-[0.2em] uppercase mb-1 ${featured ? 'text-red' : 'text-gris'}`}>
          {tranche}
        </p>
        <h3 className={`font-display text-3xl ${featured ? 'text-blanc' : 'text-noir'}`}>{categorie}</h3>
      </div>

      <div className={`font-display text-5xl mb-6 ${featured ? 'text-red' : 'text-noir'}`}>{prix}</div>

      <ul className="space-y-3 flex-1">
        {avantages.map((a) => (
          <li key={a} className={`flex items-start gap-2 text-sm ${featured ? 'text-gris' : 'text-gris'}`}>
            <span className="text-red shrink-0 mt-0.5" aria-hidden="true">♟</span>
            {a}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`mt-8 block text-center py-3 font-display tracking-wider transition-colors ${
          featured
            ? 'bg-red hover:bg-red-hover text-blanc'
            : 'border-2 border-noir hover:bg-noir hover:text-blanc text-noir'
        }`}
      >
        S'inscrire
      </Link>
    </div>
  )
}
