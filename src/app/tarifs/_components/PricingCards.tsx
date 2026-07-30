import Link from 'next/link'
import { PricingCard } from './PricingCard'
import { TarifConfigurator } from './TarifConfigurator'
import type { HelloAssoMembershipForm } from '@/src/lib/helloasso/client'

/* Repli affiché si l'API HelloAsso est indisponible */
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

export function PricingCards({ forms }: { forms: HelloAssoMembershipForm[] }) {
  if (forms.length) {
    return (
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className='text-lg text-gris'>
          <h2 className="font-display text-3xl sm:text-4xl text-noir mb-4">Trouvez votre tarif</h2>
          <p className="mb-6">
            Répondez à quelques questions pour connaître le montant exact de votre adhésion : lieu de résidence,
            catégorie d'âge, licence FFE, et cours en option. Le prix affiché est celui que vous réglerez sur
            HelloAsso.
          </p>
          <p>
            Un problème avec votre tarif ?{' '}
            <Link href="/contact" className="text-red hover:text-red-hover underline">
              Contactez-nous
            </Link>
            , nous vous répondrons rapidement.
          </p>
        </div>
        <TarifConfigurator forms={forms} />
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-start pt-4">
      {tarifsParDefaut.map((t, i) => (
        <PricingCard key={t.categorie} {...t} index={i} />
      ))}
    </div>
  )
}
