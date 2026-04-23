/* Types dérivés des schémas Sanity (src/sanity/schemaTypes/) */

export type SanityPost = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string | null
  excerpt?: string
  body?: unknown
  categories?: string[]
  mainImage: string | null
}

export type SanityTournoi = {
  _id: string
  title: string
  date: string | null
  location?: string
  level?: string
  description?: string
  registrationUrl?: string
  poster: string | null
}

export type SanityPricingTier = {
  name: string
  description?: string
  price: string
  features?: string[]
}

export type SanityPricing = {
  title?: string
  tiers?: SanityPricingTier[]
}
