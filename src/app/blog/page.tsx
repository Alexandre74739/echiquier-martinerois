import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/src/lib/sanity/queries";

export const revalidate = 60;

export const metadata = {
  title: "Blog & Actualités",
  description:
    "Suivez les actualités du club d'échecs L'Échiquier Martinérois : tournois, résultats, événements.",
};

const categorieLabels: Record<string, string> = {
  actualite: "Actualité",
  tournoi: "Tournoi",
  pedagogie: "Pédagogie",
  resultats: "Résultats",
};

export default async function BlogPage() {
  const articles = await getLatestPosts(20).catch(() => []);

  return (
    <div className="bg-blanc">
      {/* En-tête */}
      <div className="bg-noir text-blanc py-20 relative overflow-hidden">
        <div className="absolute inset-0 chess-pattern opacity-[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <span className="inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase">
              Vie du club
            </span>
          </div>
          <h1 className="font-display text-6xl sm:text-8xl text-blanc">Blog</h1>
          <p className="text-gris mt-4 max-w-xl text-lg">
            Plongez au cœur de la vie du club entre actualités, résultats et
            événements. Découvrez nos conseils pédagogiques pour booster votre
            progression, quel que soit votre niveau.
          </p>
        </div>
      </div>

      {/* Articles */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article: any, i: number) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  featured={i === 0}
                />
              ))}
            </div>
          ) : (
            <EmptyBlog />
          )}
        </div>
      </section>
    </div>
  );
}

function ArticleCard({
  article,
  featured = false,
}: {
  article: any;
  featured?: boolean;
}) {
  const date = article.publishedAt ? new Date(article.publishedAt) : null;

  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug.current}`}
        className="group sm:col-span-2 lg:col-span-3 block"
      >
        <div className="grid md:grid-cols-2 bg-noir overflow-hidden">
          {article.mainImage ? (
            <div className="relative h-64 md:h-auto overflow-hidden">
              <Image
                src={article.mainImage}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-noir/30" />
            </div>
          ) : (
            <div className="hidden md:flex h-full bg-gris-fonce items-center justify-center text-8xl text-gris">
              ♞
            </div>
          )}
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red px-2 py-0.5 text-xs text-blanc font-display tracking-wider">
                À la une
              </span>
              {date && (
                <span className="text-gris text-sm">
                  {date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <h2 className="font-display text-3xl text-blanc group-hover:text-red transition-colors mb-3">
              {article.title}
            </h2>
            {article.excerpt && (
              <p className="text-gris leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            )}
            <span className="mt-6 text-red font-display tracking-wider flex items-center gap-1">
              Lire l'article <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${article.slug.current}`} className="group block">
      <article className="border-t-4 border-gris-clair hover:border-red transition-colors bg-blanc hover:shadow-lg transition-shadow">
        {article.mainImage ? (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.mainImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="h-48 bg-gris-clair flex items-center justify-center text-6xl text-gris">
            ♟
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.categories?.map((cat: string) => (
              <span
                key={cat}
                className="text-xs bg-gris-clair text-gris px-2 py-0.5 font-display tracking-wider"
              >
                {categorieLabels[cat] ?? cat}
              </span>
            ))}
            {date && (
              <span className="text-xs text-gris">
                {date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </div>
          <h2 className="font-display text-xl text-noir group-hover:text-red transition-colors mb-2">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-gris text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function EmptyBlog() {
  return (
    <div className="text-center py-20">
      <span className="text-8xl block mb-6 text-gris" aria-hidden="true">
        ♞
      </span>
      <h2 className="font-display text-4xl text-gris mb-4">
        Aucun article pour l'instant
      </h2>
      <p className="text-gris max-w-md mx-auto">
        Les actualités du club seront publiées ici. Revenez bientôt !
      </p>
    </div>
  );
}
