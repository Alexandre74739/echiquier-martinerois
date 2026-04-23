import Image from "next/image";
import Link from "next/link";
import { getTournaments } from "@/src/lib/sanity/queries";
import { IconLocation } from "@/src/components/ui/Icons";

export const revalidate = 60;

export const metadata = {
  title: "Tournois",
  description:
    "Retrouvez tous les tournois d'échecs organisés ou recommandés par L'Échiquier Martinérois.",
};

export default async function TournoisPage() {
  const tournois = await getTournaments(20).catch(() => []);

  return (
    <div className="bg-blanc">
      {/* En-tête */}
      <div className="bg-noir text-blanc py-20 relative overflow-hidden">
        <div className="absolute inset-0 chess-pattern opacity-[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase">
              Compétitions
            </span>
          </div>
          <h1 className="font-display text-6xl sm:text-8xl text-blanc">
            Tournois
          </h1>
          <p className="text-gris mt-4 max-w-xl text-lg">
            Restez informé de nos prochains tournois et rassemblements. Nous
            sélectionnons les meilleurs événements pour tous nos membres. Que
            vous soyez compétiteur ou amateur, trouvez le défi qui vous
            correspond.
          </p>
        </div>
      </div>

      {/* Liste */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {tournois.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournois.map((t: any) => (
                <TournoisCard key={t._id} tournoi={t} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* Info compétition */}
      <section className="bg-gris-clair py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="font-display text-4xl text-noir red-line mb-4">
                Nos équipes
              </h2>
              <p className="text-gris leading-relaxed">
                L'Échiquier Martinérois engage{" "}
                <strong className="text-noir">deux équipes</strong> en
                compétition régionale. Les membres souhaitant participer peuvent
                intégrer une équipe selon leur niveau.
              </p>
              <p className="text-gris leading-relaxed mt-3">
                D'autres compétitions (tournois individuels, open régionaux)
                sont disponibles sur demande auprès du bureau du club.
              </p>
            </div>
            <div>
              <h2 className="font-display text-4xl text-noir red-line mb-4">
                Conditions
              </h2>
              <ul className="space-y-3">
                {[
                  "Être adhérent du club pour la saison en cours",
                  "Posséder une licence FFE valide",
                  "Informer le président de votre souhait de participer",
                  "Niveau évalué lors des cours ou séances libres",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-gris text-base"
                  >
                    <span
                      className="text-red shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      ♟
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-noir py-14 text-center">
        <p className="text-gris mb-6 text-lg">
          Intéressé par les compétitions ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-blanc px-8 py-4 font-display text-xl tracking-wider transition-colors"
        >
          <span aria-hidden="true">♜</span>
          Contacter le bureau
        </Link>
      </div>
    </div>
  );
}

const niveauColor: Record<string, string> = {
  débutant: "bg-green-700",
  intermédiaire: "bg-yellow-700",
  avancé: "bg-red",
  open: "bg-noir",
};

function TournoisCard({ tournoi }: { tournoi: any }) {
  const date = tournoi.date ? new Date(tournoi.date) : null;
  const passe = date ? date < new Date() : false;

  return (
    <div
      className={`bg-blanc border-t-4 overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${passe ? "border-gris opacity-70" : "border-red"}`}
    >
      {tournoi.poster && (
        <div className="relative h-52 bg-gris-clair overflow-hidden">
          <Image
            src={tournoi.poster}
            alt={`Affiche ${tournoi.title}`}
            fill
            className="object-cover"
          />
          {passe && (
            <div className="absolute inset-0 bg-noir/50 flex items-center justify-center">
              <span className="font-display text-2xl text-blanc tracking-widest">
                Terminé
              </span>
            </div>
          )}
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
        <h2 className="font-display text-2xl text-noir mb-2">
          {tournoi.title}
        </h2>
        {date && (
          <p
            className={`text-sm font-semibold mb-1 ${passe ? "text-gris" : "text-red"}`}
          >
            {date.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        {tournoi.location && (
          <p className="text-gris text-sm flex items-center gap-1.5">
            <IconLocation size={13} className="text-red shrink-0" />
            {tournoi.location}
          </p>
        )}
        {tournoi.description && (
          <p className="text-gris text-sm mt-3 leading-relaxed line-clamp-3">
            {tournoi.description}
          </p>
        )}
        {tournoi.registrationUrl && !passe && (
          <a
            href={tournoi.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block border border-red text-red hover:bg-red hover:text-blanc px-4 py-2 text-sm font-display tracking-wider transition-colors"
          >
            S'inscrire
          </a>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <span className="text-8xl block mb-6 text-gris" aria-hidden="true">
        ♛
      </span>
      <h2 className="font-display text-4xl text-gris mb-4">
        Aucun tournoi annoncé
      </h2>
      <p className="text-gris max-w-md mx-auto mb-8">
        Les prochains tournois seront publiés ici dès qu'ils seront confirmés.
        N'hésitez pas à nous contacter pour vous tenir informé.
      </p>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 text-red font-display tracking-wider hover:underline"
      >
        <span aria-hidden="true">♞</span> Nous contacter
      </Link>
    </div>
  );
}
