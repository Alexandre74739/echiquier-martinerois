import { HELLOASSO_ORGANIZATION_SLUG } from '@/src/lib/config'

const HELLOASSO_API_URL = 'https://api.helloasso.com'

export type HelloAssoExtraOption = {
  id: number
  label: string
  description: string
  price: number /* en centimes */
  isRequired: boolean
}

export type HelloAssoTier = {
  id: number
  label: string
  description: string
  price: number /* en centimes */
  extraOptions: HelloAssoExtraOption[]
}

export type HelloAssoMembershipForm = {
  title: string
  description: string
  state: string
  formSlug: string
  tiers: HelloAssoTier[]
  widgetFullUrl: string
}

type TokenCache = { accessToken: string; expiresAt: number }
let tokenCache: TokenCache | null = null

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.HELLOASSO_CLIENT_ID
  const clientSecret = process.env.HELLOASSO_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.accessToken
  }

  const res = await fetch(`${HELLOASSO_API_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  })
  if (!res.ok) return null

  const data = (await res.json()) as { access_token: string; expires_in: number }
  /* On raccourcit la durée de vie de 60s par sécurité pour éviter d'utiliser un token expiré */
  tokenCache = { accessToken: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
  return tokenCache.accessToken
}

async function getMembershipForm(formSlug: string): Promise<HelloAssoMembershipForm | null> {
  const token = await getAccessToken()
  if (!token) return null

  const res = await fetch(
    `${HELLOASSO_API_URL}/v5/organizations/${HELLOASSO_ORGANIZATION_SLUG}/forms/Membership/${formSlug}/public`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) return null

  const data = await res.json()
  return {
    title: data.title,
    description: data.description,
    state: data.state,
    formSlug: data.formSlug,
    widgetFullUrl: data.widgetFullUrl,
    tiers: (data.tiers ?? []).map((t: {
      id: number
      label: string
      description: string
      price: number
      extraOptions?: { id: number; label: string; description: string; price: number; isRequired: boolean }[]
    }) => ({
      id: t.id,
      label: t.label.replace(/\s+/g, ' ').trim(),
      description: (t.description ?? '').replace(/\s+/g, ' ').trim(),
      price: t.price,
      extraOptions: (t.extraOptions ?? []).map((o) => ({
        id: o.id,
        label: o.label.replace(/\s+/g, ' ').trim(),
        description: (o.description ?? '').replace(/\s+/g, ' ').trim(),
        price: o.price,
        isRequired: o.isRequired,
      })),
    })),
  }
}

export async function getMembershipForms(): Promise<HelloAssoMembershipForm[]> {
  const formSlugs = [
    process.env.HELLOASSO_FORM_SLUG_MARTINEROIS,
    process.env.HELLOASSO_FORM_SLUG_SPORT,
  ].filter((slug): slug is string => !!slug)

  const forms = await Promise.all(
    formSlugs.map((slug) => getMembershipForm(slug).catch(() => null)),
  )
  return forms.filter((form): form is HelloAssoMembershipForm => form !== null)
}
