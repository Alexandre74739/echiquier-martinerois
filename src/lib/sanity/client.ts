import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource, ImageUrlBuilder } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export function isSanityConfigured(): boolean {
  return !!projectId
}

let _client: ReturnType<typeof createClient> | null = null

function getClient() {
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

export const sanityClient = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getClient()
    if (!client) return () => Promise.resolve(null)
    /* Double cast nécessaire : SanityClient n'a pas d'index signature */
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    /* Sans .bind(), `this` est perdu à l'appel et le fetch plante silencieusement */
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})

const _builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null

export function urlFor(source: SanityImageSource): ImageUrlBuilder {
  if (!_builder) return { url: () => null } as unknown as ImageUrlBuilder
  return _builder.image(source)
}
