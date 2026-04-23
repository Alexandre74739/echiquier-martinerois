const faq = [
  {
    q: 'Faut-il apporter du matériel ?',
    r: "Non, le club met à disposition échiquiers et pièces. Venez les mains dans les poches !",
  },
  {
    q: 'Mon enfant peut-il venir sans inscription préalable ?',
    r: "Oui, il peut venir découvrir un premier mardi. Nous vous conseillons de prévenir par email pour un meilleur accueil.",
  },
  {
    q: 'Les cours ont-ils lieu pendant les vacances scolaires ?',
    r: "Non. Le club se réunit tous les mardis hors vacances scolaires de la zone académique.",
  },
  {
    q: 'Comment payer la cotisation ?',
    r: "La cotisation se règle en espèces ou par chèque à l'ordre du club, en début de saison.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-4xl text-noir mb-10 red-line">Questions fréquentes</h2>
        <div className="space-y-6">
          {faq.map(({ q, r }) => (
            <div key={q} className="border-l-4 border-red pl-6 py-1">
              <h3 className="font-semibold text-noir mb-1">{q}</h3>
              <p className="text-gris text-sm leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
