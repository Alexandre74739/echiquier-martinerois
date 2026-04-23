import { sanityClient, isSanityConfigured, urlFor } from './client'
import type { SanityPost, SanityTournoi } from '@/src/types/sanity'

function resolveImage(image: unknown): string | null {
  if (!image || typeof image !== 'object' || !('asset' in image)) return null
  return urlFor(image).width(800).url()
}

export async function getLatestPosts(limit = 6): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return []
  const posts = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, publishedAt, excerpt,
      "mainImage": mainImage
    }`,
    { limit: limit - 1 }
  )
  return (posts as SanityPost[]).map((p) => ({ ...p, mainImage: resolveImage(p.mainImage) }))
}

export async function getPostBySlug(slug: string) {
  if (!isSanityConfigured()) return null
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, excerpt, body, categories,
      "mainImage": mainImage
    }`,
    { slug }
  )
  if (!post) return null
  return { ...post, mainImage: resolveImage(post.mainImage) }
}

export async function getAllPostSlugs() {
  if (!isSanityConfigured()) return []
  return sanityClient.fetch(`*[_type == "post"]{ "slug": slug.current }`)
}

export async function getTournaments(limit = 10) {
  if (!isSanityConfigured()) return []
  const tournois = await sanityClient.fetch(
    `*[_type == "tournament"] | order(date asc) [0...$limit] {
      _id, title, date, location, level, description, registrationUrl,
      "poster": poster
    }`,
    { limit: limit - 1 }
  )
  return (tournois as SanityTournoi[]).map((t) => ({ ...t, poster: resolveImage(t.poster) }))
}

export async function getPricing() {
  if (!isSanityConfigured()) return null
  return sanityClient.fetch(`*[_type == "pricing"][0]{ title, tiers }`)
}
