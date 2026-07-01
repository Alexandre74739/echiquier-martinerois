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
    reponse: "La cotisation se règle en espèces ou par chèque à l'ordre du club, en début de saison.",
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
