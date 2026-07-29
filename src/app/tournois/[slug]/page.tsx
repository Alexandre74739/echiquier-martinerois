import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTournamentBySlug, getAllTournamentSlugs } from "@/src/lib/sanity/queries";
import { IconLocation } from "@/src/components/ui/Icons";
import { ZoomableImage } from "@/src/components/ui/ZoomableImage";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { Reveal } from "@/src/components/motion/Reveal";
import { BASE_URL } from "@/src/lib/config";

export const revalidate = 60;

const niveauColor: Record<string, string> = {
  débutant: "bg-green-700",
  intermédiaire: "bg-yellow-700",
  avancé: "bg-red",
  open: "bg-noir",
};

export async function generateStaticParams() {
  const slugs = await getAllTournamentSlugs().catch(() => []);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/tournois/[slug]">) {
  const { slug } = await props.params;
  const tournoi = await getTournamentBySlug(slug).catch(() => null);
  if (!tournoi) return { title: "Tournoi introuvable" };
  return {
    title: tournoi.title,
    description: tournoi.description,
    alternates: {
      canonical: `${BASE_URL}/tournois/${slug}`,
    },
    openGraph: {
      title: tournoi.title,
      description: tournoi.description ?? undefined,
      type: "article",
      images: tournoi.poster ? [tournoi.poster] : [],
    },
  };
}

export default async function TournoiPage(props: PageProps<"/tournois/[slug]">) {
  const { slug } = await props.params;
  const tournoi = await getTournamentBySlug(slug).catch(() => null);

  if (!tournoi) notFound();

  const date = tournoi.date ? new Date(tournoi.date) : null;
  const passe = date ? date < new Date() : false;
  const safeUrl =
    tournoi.registrationUrl?.startsWith("http") ? tournoi.registrationUrl : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Tournois", item: `${BASE_URL}/tournois` },
      { "@type": "ListItem", position: 3, name: tournoi.title, item: `${BASE_URL}/tournois/${slug}` },
    ],
  };

  return (
    <div className="bg-blanc">
      <JsonLd data={breadcrumbJsonLd} />
      {/* En-tête */}
      <div className="bg-noir text-blanc relative overflow-hidden">
        {tournoi.poster && (
          <div className="absolute inset-0">
            <Image
              src={tournoi.poster}
              alt=""
              aria-hidden="true"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/80 to-noir" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link
            href="/tournois"
            className="inline-flex items-center gap-2 text-gris hover:text-red transition-colors text-sm mb-8 font-display tracking-wider"
          >
            <span aria-hidden="true">←</span> Retour aux tournois
          </Link>

          <Reveal>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {tournoi.level && (
                <span
                  className={`px-2 py-0.5 text-xs text-blanc font-display tracking-wider ${niveauColor[tournoi.level] ?? "bg-red"}`}
                >
                  {tournoi.level}
                </span>
              )}
              {passe && (
                <span className="bg-gris px-2 py-0.5 text-xs text-blanc font-display tracking-wider">
                  Terminé
                </span>
              )}
              {date && (
                <time className="text-gris text-sm" dateTime={tournoi.date ?? undefined}>
                  {date.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-blanc leading-tight">
              {tournoi.title}
            </h1>

            {tournoi.location && (
              <p className="mt-4 text-gris text-lg flex items-center gap-2">
                <IconLocation size={16} className="text-red shrink-0" />
                {tournoi.location}
              </p>
            )}
          </Reveal>
        </div>
      </div>

      {/* Contenu */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {tournoi.poster && (
          <Reveal className="relative h-64 sm:h-96 mb-12 overflow-hidden bg-gris-clair">
            <ZoomableImage
              src={tournoi.poster}
              alt={`Affiche ${tournoi.title}`}
              imgClassName="object-cover"
            />
          </Reveal>
        )}

        {tournoi.description ? (
          <Reveal delay={0.1} className="prose prose-lg max-w-none">
            {tournoi.description.split("\n").filter(Boolean).map((paragraph, i) => (
              <p key={i} className="text-gris leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </Reveal>
        ) : (
          <p className="text-gris italic">
            Détails du tournoi non disponibles.
          </p>
        )}

        {safeUrl && !passe && (
          <Reveal delay={0.15} className="mt-8">
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red hover:bg-red-hover text-blanc px-6 py-3 font-display tracking-wider transition-colors"
            >
              S'inscrire
            </a>
          </Reveal>
        )}

        {/* Pied de page */}
        <div className="mt-16 pt-8 border-t border-gris-clair flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/tournois"
            className="inline-flex items-center gap-2 text-red font-display tracking-wider hover:underline"
          >
            <span aria-hidden="true">←</span> Retour aux tournois
          </Link>
          <div className="flex items-center gap-3 text-sm text-gris">
            <span aria-hidden="true" className="text-red text-xl">
              ♜
            </span>
            <span>L'Échiquier Martinérois</span>
          </div>
        </div>
      </article>
    </div>
  );
}
