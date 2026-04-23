import Image from "next/image";
import Link from "next/link";
import { IconChevronRight } from "@/src/components/ui/Icons";

function ArticleCard({ article }: { article: any }) {
  const date = article.publishedAt ? new Date(article.publishedAt) : null;
  return (
    <Link href={`/blog/${article.slug.current}`} className="group block">
      <div className="bg-gris-fonce hover:bg-[#1a1a1a] transition-colors">
        {article.mainImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={article.mainImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-noir/40" />
          </div>
        )}
        <div className="p-6">
          {date && (
            <p className="text-red text-xs font-display tracking-wider mb-2">
              {date.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <h3 className="font-display text-xl text-blanc group-hover:text-red transition-colors mb-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gris text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

const placeholders = [
  {
    icon: "♜",
    titre: "Saison 2024/2025",
    desc: "Réouverture du club à la rentrée avec de nouveaux cours.",
  },
  {
    icon: "♞",
    titre: "Championnat scolaire",
    desc: "Nos jeunes joueurs brillent lors du championnat scolaire.",
  },
  {
    icon: "♛",
    titre: "Fête locale",
    desc: "L'Échiquier Martinérois à la fête locale — grande réussite !",
  },
];

export function SectionBlog({ articles }: { articles: any[] }) {
  return (
    <section className="bg-noir py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="font-display text-5xl sm:text-6xl text-blanc red-line">
              Actualités
            </h2>
            <p className="text-gris mt-2">Suivez la vie du club</p>
          </div>
          <Link
            href="/blog"
            className="text-red font-display tracking-wider hover:underline flex items-center gap-1"
          >
            Toutes les actualités <IconChevronRight className="mt-0.5" />
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholders.map(({ icon, titre, desc }) => (
              <div key={titre} className="bg-gris-fonce p-6">
                <span
                  className="text-3xl block mb-4 text-red"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h3 className="font-display text-xl text-blanc mb-2">
                  {titre}
                </h3>
                <p className="text-gris text-sm">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
