import Image from "next/image";
import Link from "next/link";
import { IconChevronRight } from "@/src/components/ui/Icons";

const niveauColor: Record<string, string> = {
  débutant: "bg-green-700",
  intermédiaire: "bg-yellow-700",
  avancé: "bg-red",
  open: "bg-noir",
};

function TournoisCard({ tournoi }: { tournoi: any }) {
  const date = tournoi.date ? new Date(tournoi.date) : null;
  return (
    <div className="bg-blanc border-t-4 border-red overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {tournoi.poster && (
        <div className="relative h-48 bg-gris-clair">
          <Image
            src={tournoi.poster}
            alt={tournoi.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {tournoi.level && (
          <span
            className={`inline-block text-xs text-blanc px-2 py-0.5 mb-3 font-display tracking-wider ${niveauColor[tournoi.level] ?? "bg-noir"}`}
          >
            {tournoi.level}
          </span>
        )}
        <h3 className="font-display text-xl text-noir mb-2">{tournoi.title}</h3>
        {date && (
          <p className="text-red text-sm font-semibold mb-1">
            {date.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {tournoi.location && (
          <p className="text-gris text-sm">{tournoi.location}</p>
        )}
      </div>
    </div>
  );
}

function PlaceholderTournois() {
  return (
    <div className="bg-gris-clair p-12 text-center">
      <span className="text-6xl block mb-4 text-gris" aria-hidden="true">
        ♛
      </span>
      <p className="font-display text-2xl text-gris mb-2">
        Aucun tournoi annoncé
      </p>
      <p className="text-gris text-sm">
        Les prochains tournois seront publiés prochainement.
      </p>
    </div>
  );
}

export function SectionTournois({ tournois }: { tournois: any[] }) {
  return (
    <section className="bg-blanc py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-5xl sm:text-6xl text-noir red-line">
              Tournois
            </h2>
            <p className="text-gris mt-2">
              Prochains événements à ne pas manquer
            </p>
          </div>
          <Link
            href="/tournois"
            className="text-red font-display tracking-wider hover:underline flex items-center gap-1"
          >
            Voir tous <IconChevronRight className="mt-0.5" />
          </Link>
        </div>

        {tournois.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournois.map((t) => (
              <TournoisCard key={t._id} tournoi={t} />
            ))}
          </div>
        ) : (
          <PlaceholderTournois />
        )}
      </div>
    </section>
  );
}
