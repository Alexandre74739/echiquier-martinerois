import { BASE_URL } from '@/src/lib/config'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/* Notifie IndexNow (Bing, Yandex, Seznam...) qu'une liste d'URLs a changé,
   pour déclencher un recrawl sans attendre le passage naturel des robots. */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  const key = process.env.INDEXNOW_KEY

  if (!key || urls.length === 0) {
    console.error('[indexnow] Clé INDEXNOW_KEY manquante ou aucune URL à soumettre')
    return false
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(BASE_URL).host,
      key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList: urls,
    }),
  })

  if (!res.ok) {
    console.error(`[indexnow] Soumission échouée: ${res.status}`)
    return false
  }

  return true
}
