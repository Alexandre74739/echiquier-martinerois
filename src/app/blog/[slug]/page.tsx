import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/src/lib/sanity/queries";
import { PortableText } from "next-sanity";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs().catch(() => []);
  return slugs.map((s: { slug: string }) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: post.mainImage ? [post.mainImage] : [] },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) notFound();

  const date = post.publishedAt ? new Date(post.publishedAt) : null;

  return (
    <div className="bg-blanc">
      {/* En-tête article */}
      <div className="bg-noir text-blanc relative overflow-hidden">
        {post.mainImage && (
          <div className="absolute inset-0">
            <Image
              src={post.mainImage}
              alt={post.title}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noir/80 to-noir" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gris hover:text-red transition-colors text-sm mb-8 font-display tracking-wider"
          >
            <span aria-hidden="true">←</span> Retour au blog
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            {post.categories?.map((cat: string) => (
              <span
                key={cat}
                className="bg-red px-2 py-0.5 text-xs text-blanc font-display tracking-wider"
              >
                {cat}
              </span>
            ))}
            {date && (
              <time className="text-gris text-sm" dateTime={post.publishedAt}>
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
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-gris text-xl leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Corps de l'article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {post.mainImage && (
          <div className="relative h-64 sm:h-96 mb-12 overflow-hidden">
            <Image
              src={post.mainImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {post.body ? (
          <div
            className="prose prose-lg max-w-none
            prose-headings:font-display prose-headings:tracking-wide
            prose-h2:text-4xl prose-h3:text-3xl
            prose-a:text-red prose-a:no-underline hover:prose-a:underline
            prose-strong:text-noir
            prose-img:rounded-none
          "
          >
            <PortableText
              value={post.body}
              components={{
                types: {
                  image: ({ value }) =>
                    value?.asset ? (
                      <figure className="my-8">
                        <div className="relative h-96 w-full">
                          <Image
                            src={value.asset._ref}
                            alt={value.alt ?? ""}
                            fill
                            className="object-contain"
                          />
                        </div>
                        {value.caption && (
                          <figcaption className="text-center text-sm text-gris mt-2">
                            {value.caption}
                          </figcaption>
                        )}
                      </figure>
                    ) : null,
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gris italic">
            Contenu de l'article non disponible.
          </p>
        )}

        {/* Pied d'article */}
        <div className="mt-16 pt-8 border-t border-gris-clair flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-red font-display tracking-wider hover:underline"
          >
            <span aria-hidden="true">←</span> Retour au blog
          </Link>
          <div className="flex items-center gap-3 text-sm text-gris">
            <span aria-hidden="true" className="text-red text-xl">
              ♞
            </span>
            <span>L'Échiquier Martinérois</span>
          </div>
        </div>
      </article>
    </div>
  );
}
