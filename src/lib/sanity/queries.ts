import { sanityClient, isSanityConfigured, urlFor } from './client'
import type { SanityPost, SanityTournoi } from '@/src/types/sanity'
import type { SanityImageObject } from '@sanity/image-url'

/** Type interne pour les documents Sanity avant résolution des images */
type RawSanityPost = Omit<SanityPost, 'mainImage'> & { mainImage: SanityImageObject | null }
type RawSanityTournoi = Omit<SanityTournoi, 'poster' | 'posterPosition'> & { poster: SanityImageObject | null }

function resolveImage(image: SanityImageObject | null): string | null {
  if (!image?.asset) return null
  return urlFor(image).width(800).url()
}

function resolveImagePosition(image: SanityImageObject | null): string {
  const hotspot = image?.hotspot
  if (!hotspot) return '50% 0%'
  const crop = image.crop ?? { left: 0, right: 0, top: 0, bottom: 0 }
  const x = (hotspot.x - crop.left) / (1 - crop.left - crop.right)
  const y = (hotspot.y - crop.top) / (1 - crop.top - crop.bottom)
  const pct = (v: number) => `${Math.round(Math.min(Math.max(v, 0), 1) * 100)}%`
  return `${pct(x)} ${pct(y)}`
}

function resolveTournoi(t: RawSanityTournoi): SanityTournoi {
  return { ...t, poster: resolveImage(t.poster), posterPosition: resolveImagePosition(t.poster) }
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
  return (tournois ?? []).map(resolveTournoi)
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
  return (tournois ?? []).map(resolveTournoi)
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
  return resolveTournoi(tournoi)
}

export async function getAllTournamentSlugs(): Promise<{ slug: string }[]> {
  if (!isSanityConfigured()) return []
  return (await sanityClient.fetch<{ slug: string }[]>(
    `*[_type == "tournament"]{ "slug": coalesce(slug.current, _id) }`
  )) ?? []
}
