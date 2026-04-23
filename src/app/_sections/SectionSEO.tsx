const niveaux = [
  { piece: '♟', titre: 'Débutants', desc: 'Initiation aux règles et à la stratégie de base.' },
  { piece: '♞', titre: 'Intermédiaires', desc: "Perfectionnement tactique et étude d'ouvertures." },
  { piece: '♜', titre: 'Compétiteurs', desc: 'Préparation aux tournois régionaux et nationaux.' },
  { piece: '♛', titre: 'Enfants', desc: 'Cours ludiques dès 6 ans, le mardi de 18h à 19h.' },
]

export function SectionSEO() {
  return (
    <section className="bg-gris-clair py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-noir px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase mb-4">
              Grenoble · SMH
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-noir mb-4 red-line">
              Les échecs à<br />Saint-Martin-d'Hères
            </h2>
            <p className="text-gris leading-relaxed mb-4">
              Fondé à Saint-Martin-d'Hères dans l'agglomération grenobloise, l'Échiquier Martinérois
              accueille joueurs et joueuses de tous niveaux. Que vous soyez débutant curieux,
              parent souhaitant initier votre enfant ou joueur confirmé, notre club vous ouvre
              ses portes chaque mardi.
            </p>
            <p className="text-gris leading-relaxed">
              Proche du centre de Grenoble, nous participons aux compétitions de la Ligue
              Dauphiné-Savoie et proposons des cours structurés. Les échecs développent la
              concentration, la logique et la créativité de 6 à 99 ans.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {niveaux.map(({ piece, titre, desc }) => (
              <div key={titre} className="bg-blanc p-5 border-l-4 border-red hover:shadow-lg transition-shadow">
                <span className="text-2xl text-noir block mb-2" aria-hidden="true">{piece}</span>
                <p className="font-display text-lg text-noir tracking-wide">{titre}</p>
                <p className="text-gris text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
