export type PortableTextSpan = {
  _type: string
  _key: string
  text?: string
  marks?: string[]
}

export type PortableTextMarkDef = {
  _type: string
  _key: string
  href?: string
}

export type PortableTextBlock = {
  _type: string
  _key: string
  style?: string
  listItem?: string
  level?: number
  markDefs?: PortableTextMarkDef[]
  children?: PortableTextSpan[]
  asset?: { _type: string; _ref: string }
  alt?: string
  caption?: string
}

export type SanityPost = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string | null
  excerpt?: string
  body?: PortableTextBlock[]
  categories?: string[]
  mainImage: string | null
}

export type SanityTournoi = {
  _id: string
  title: string
  slug?: { current: string }
  date: string | null
  location?: string
  level?: string
  description?: string
  registrationUrl?: string
  poster: string | null
}
