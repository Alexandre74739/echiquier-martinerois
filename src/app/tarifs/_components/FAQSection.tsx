import { Reveal } from '@/src/components/motion/Reveal'
import { Accordion, type AccordionItem } from '@/src/components/ui/Accordion'

const faq: AccordionItem[] = [
  {
    question: 'Faut-il apporter du matériel ?',
    reponse: "Non, le club met à disposition échiquiers et pièces. Venez les mains dans les poches !",
  },
  {
    question: 'Mon enfant peut-il venir sans inscription préalable ?',
    reponse: "Oui, il peut venir découvrir un premier mardi. Nous vous conseillons de prévenir par email pour un meilleur accueil.",
  },
  {
    question: 'Les cours ont-ils lieu pendant les vacances scolaires ?',
    reponse: "Non. Le club se réunit tous les mardis hors vacances scolaires de la zone académique.",
  },
  {
    question: 'Comment payer la cotisation ?',
    reponse:
      "Vous pouvez régler en ligne par carte bancaire via notre configurateur de tarifs ci-dessus (paiement sécurisé HelloAsso), ou en espèces ou par chèque à l'ordre du club, en début de saison.",
  },
  {
    question: 'Quelle est la différence entre la licence A et la licence B ?',
    reponse:
      "La licence A permet de participer à toutes les compétitions homologuées par la FFE (parties classiques, rapides et blitz...) et donne accès au classement Elo national et FIDE ; elle est nécessaire pour les compétitions par équipes. La licence B, moins chère, inclut l'assurance FFE mais ne permet de jouer qu'en compétitions rapides (cadence inférieure à 1h), avec classement rapide uniquement. Choisissez la licence A si vous souhaitez jouer des tournois classiques, la licence B si vous jouez surtout pour le loisir.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-4xl text-noir mb-10 red-line">Questions fréquentes</h2>
        </Reveal>
        <Accordion items={faq} />
      </div>
    </section>
  )
}
