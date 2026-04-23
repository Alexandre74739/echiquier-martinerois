const chiffres = [
  { chiffre: '2', label: 'Équipes en compétition', icon: '♜' },
  { chiffre: '3', label: "Groupes d'âge", icon: '♟' },
  { chiffre: '+10', label: "Années d'histoire", icon: '♛' },
  { chiffre: '1', label: 'Soir par semaine', icon: '♞' },
]

export function SectionChiffres() {
  return (
    <section className="bg-noir py-16 border-t border-b border-gris-fonce">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {chiffres.map(({ chiffre, label, icon }) => (
            <div key={label}>
              <span className="text-2xl text-gris block mb-1" aria-hidden="true">{icon}</span>
              <div className="font-display text-5xl sm:text-6xl leading-none mb-1 text-red">{chiffre}</div>
              <p className="text-sm text-gris uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
