import { PricingCard } from './PricingCard'

/* Ordre : Gratuit (gauche) → Enfant (centre, featured) → Adulte (droite) */
const tarifsParDefaut = [
  {
    categorie: 'Découverte',
    tranche: 'Premier cours',
    prix: 'Gratuit',
    avantages: ['Venez essayer sans engagement', 'Accueil par nos membres', 'Évaluation de votre niveau', 'Aucun matériel requis'],
    featured: false,
  },
  {
    categorie: 'Enfant / Jeune',
    tranche: 'Moins de 18 ans',
    prix: 'Sur demande',
    avantages: ['Cours jeunes (18h–19h)', 'Accès au jeu libre', 'Licence FFE en option', 'Compétitions scolaires'],
    featured: true,
    badge: 'Notre offre jeunesse',
  },
  {
    categorie: 'Adulte',
    tranche: '18 ans et plus',
    prix: 'Sur demande',
    avantages: ['Cours adultes (19h–20h)', 'Accès au jeu libre', 'Licence FFE incluse', 'Compétitions régionales'],
    featured: false,
  },
]

export function PricingCards({ data }: { data: any }) {
  if (data?.tiers?.length) {
    return (
      <div className="grid md:grid-cols-3 gap-8 items-start pt-4">
        {data.tiers.map((tier: any, i: number) => (
          <PricingCard
            key={tier.name}
            categorie={tier.name}
            tranche={tier.description ?? ''}
            prix={tier.price}
            avantages={tier.features ?? []}
            featured={i === 1}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start pt-4">
      {tarifsParDefaut.map((t) => <PricingCard key={t.categorie} {...t} />)}
    </div>
  )
}
