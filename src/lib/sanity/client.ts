import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export function isSanityConfigured(): boolean {
  return !!projectId
}

/* Le client n'est instancié que si Sanity est configuré */
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
    const value = (client as any)[prop]
    /* Sans .bind(), `this` est perdu à l'appel et le fetch plante silencieusement */
    return typeof value === 'function' ? value.bind(client) : value
  },
})

const _builder = projectId
  ? imageUrlBuilder(createClient({ projectId, dataset, apiVersion: '2024-01-01', useCdn: false }))
  : null

export function urlFor(source: SanityImageSource) {
  if (!_builder) return { url: () => null } as any
  return _builder.image(source)
}
