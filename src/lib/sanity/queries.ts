import { sanityClient, isSanityConfigured, urlFor } from './client'
import type { SanityPost, SanityTournoi, SanityPricing } from '@/src/types/sanity'
import type { SanityImageObject } from '@sanity/image-url'

/** Type interne pour les documents Sanity avant résolution des images */
type RawSanityPost = Omit<SanityPost, 'mainImage'> & { mainImage: SanityImageObject | null }
type RawSanityTournoi = Omit<SanityTournoi, 'poster'> & { poster: SanityImageObject | null }

function resolveImage(image: SanityImageObject | null): string | null {
  if (!image?.asset) return null
  return urlFor(image).width(800).url()
}

export async function getLatestPosts(limit = 6): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return []
  const posts = await sanityClient.fetch<RawSanityPost[]>(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] {
      _id, title, slug, publishedAt, excerpt,
      "mainImage": mainImage
    }`,
    { limit }
  )
  return (posts ?? []).map((p) => ({ ...p, mainImage: resolveImage(p.mainImage) }))
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  if (!isSanityConfigured()) return null
  const post = await sanityClient.fetch<RawSanityPost>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, excerpt, body, categories,
      "mainImage": mainImage
    }`,
    { slug }
  )
  if (!post) return null
  return { ...post, mainImage: resolveImage(post.mainImage) }
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return []
  return (await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "post"]{ "slug": slug.current }`
  )) ?? []
}

export async function getTournaments(limit = 10): Promise<SanityTournoi[]> {
  if (!isSanityConfigured()) return []
  const tournois = await sanityClient.fetch<RawSanityTournoi[]>(
    `*[_type == "tournament" && date >= now()] | order(date asc) [0...$limit] {
      _id, title, slug, date, location, level, description, registrationUrl,
      "poster": poster
    }`,
    { limit }
  )
  return (tournois ?? []).map((t) => ({ ...t, poster: resolveImage(t.poster) }))
}

export async function getPastTournaments(limit = 6): Promise<SanityTournoi[]> {
  if (!isSanityConfigured()) return []
  const tournois = await sanityClient.fetch<RawSanityTournoi[]>(
    `*[_type == "tournament" && date < now()] | order(date desc) [0...$limit] {
      _id, title, slug, date, location, level, description, registrationUrl,
      "poster": poster
    }`,
    { limit }
  )
  return (tournois ?? []).map((t) => ({ ...t, poster: resolveImage(t.poster) }))
}

export async function getTournamentBySlug(slug: string): Promise<SanityTournoi | null> {
  if (!isSanityConfigured()) return null
  const tournoi = await sanityClient.fetch<RawSanityTournoi>(
    `*[_type == "tournament" && (slug.current == $slug || _id == $slug)][0] {
      _id, title, slug, date, location, level, description, registrationUrl,
      "poster": poster
    }`,
    { slug }
  )
  if (!tournoi) return null
  return { ...tournoi, poster: resolveImage(tournoi.poster) }
}

export async function getAllTournamentSlugs(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return []
  return (await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "tournament"]{ "slug": coalesce(slug.current, _id) }`
  )) ?? []
}

export async function getPricing(): Promise<SanityPricing | null> {
  if (!isSanityConfigured()) return null
  return sanityClient.fetch<SanityPricing>(
    `*[_type == "pricing"][0]{ title, tiers }`
  )
}
