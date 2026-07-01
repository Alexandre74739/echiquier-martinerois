import { Reveal } from '@/src/components/motion/Reveal'
import { Accordion, type AccordionItem } from '@/src/components/ui/Accordion'

export type FAQItem = AccordionItem

export function SectionFAQ({ items }: { items: FAQItem[] }) {
  return (
    <section className="bg-gris-clair py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-4xl text-noir mb-10 red-line">Questions fréquentes</h2>
        </Reveal>
        <Accordion items={items} />
      </div>
    </section>
  )
}
