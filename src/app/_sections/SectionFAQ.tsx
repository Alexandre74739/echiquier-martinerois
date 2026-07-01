export type FAQItem = { question: string; reponse: string }

export function SectionFAQ({ items }: { items: FAQItem[] }) {
  return (
    <section className="bg-gris-clair py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl text-noir mb-10 red-line">Questions fréquentes</h2>
        <div className="space-y-6">
          {items.map(({ question, reponse }) => (
            <div key={question} className="border-l-4 border-red pl-6 py-1">
              <h3 className="font-semibold text-noir mb-1">{question}</h3>
              <p className="text-gris text-sm leading-relaxed">{reponse}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
