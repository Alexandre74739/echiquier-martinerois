import { IconLocation } from "@/src/components/ui/Icons";

const activites = [
  {
    icon: "♟",
    titre: "Cours Jeunes",
    desc: "Mardis 18h–19h, cours adaptés aux enfants tous niveaux.",
    couleur: "border-red",
  },
  {
    icon: "♞",
    titre: "Cours Adultes",
    desc: "19h–20h, perfectionnez votre jeu avec nos entraîneurs.",
    couleur: "border-noir",
  },
  {
    icon: "♜",
    titre: "Jeu Libre",
    desc: "20h–22h, parties amicales dans une ambiance conviviale.",
    couleur: "border-red",
  },
  {
    icon: "♛",
    titre: "Compétitions",
    desc: "Deux équipes en compétition régionale. Tournois sur demande.",
    couleur: "border-noir",
  },
];

export function InfosClub() {
  return (
    <section className="bg-blanc py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-1 bg-red" />
            <h2 className="font-display text-5xl sm:text-6xl text-noir uppercase">
              Le Club
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activites.map(({ icon, titre, desc, couleur }) => (
            <div
              key={titre}
              className={`bg-blanc border-t-6 ${couleur} p-6 shadow-sm hover:shadow-lg transition-shadow group`}
            >
              <span
                className="text-4xl block mb-4 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                {icon}
              </span>
              <h3 className="font-display text-2xl text-noir mb-2 tracking-wide">
                {titre}
              </h3>
              <p className="text-gris text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-noir text-blanc p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-red shrink-0">
            <IconLocation size={40} />
          </div>
          <div>
            <p className="font-display text-2xl tracking-wider mb-1">
              Où nous trouver
            </p>
            <p className="text-gris">
              Place de la Liberté, Saint-Martin-d'Hères, entrée du côté de
              l'église
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Place+de+la+Liberté+Saint-Martin-d'Hères"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto shrink-0 border border-red text-red hover:bg-red hover:text-blanc px-5 py-2 font-display tracking-wider transition-colors text-sm"
          >
            Voir sur la carte
          </a>
        </div>
      </div>
    </section>
  );
}
