import { createClient } from '@sanity/client'
import type { QueryParams } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource, ImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export function isSanityConfigured(): boolean {
  return !!projectId
}

let _client: ReturnType<typeof createClient> | null = null

function getClient(): ReturnType<typeof createClient> | null {
  if (!projectId) return null
  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      useCdn: process.env.NODE_ENV === 'production',
    })
  }
  return _client
}

export const sanityClient = {
  fetch: <R>(query: string, params?: QueryParams): Promise<R | null> => {
    const client = getClient()
    if (!client) return Promise.resolve(null)
    /* On sépare les deux surcharges pour satisfaire les types @sanity/client */
    if (params) return client.fetch<R>(query, params)
    return client.fetch<R>(query)
  },
}

const _builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  if (!_builder) throw new Error('Sanity image URL builder non initialisé')
  return _builder.image(source)
}