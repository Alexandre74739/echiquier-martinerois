'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type CookiePrefs = {
  necessary: true
  analytics: boolean
}

type CookieCtx = {
  prefs: CookiePrefs | null
  accepted: boolean
  savePrefs: (prefs: CookiePrefs) => void
  openBanner: () => void
  bannerOpen: boolean
}

const CookieContext = createContext<CookieCtx>({
  prefs: null,
  accepted: false,
  savePrefs: () => {},
  openBanner: () => {},
  bannerOpen: false,
})

const COOKIE_NAME = 'cookie-prefs'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 an en secondes

/* Lecture du cookie de consentement (accessible côté serveur via middleware) */
function readCookiePrefs(): CookiePrefs | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`)
  )
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    /* Cookie corrompu — on le supprime et on réouvre la bannière */
    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/`
    return null
  }
}

function writeCookiePrefs(prefs: CookiePrefs) {
  const value = encodeURIComponent(JSON.stringify(prefs))
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:'
      ? '; Secure'
      : ''
  document.cookie = `${COOKIE_NAME}=${value}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<CookiePrefs | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    const stored = readCookiePrefs()
    if (stored) {
      setPrefs(stored)
    } else {
      setBannerOpen(true)
    }
  }, [])

  const savePrefs = (p: CookiePrefs) => {
    writeCookiePrefs(p)
    setPrefs(p)
    setBannerOpen(false)
  }

  return (
    <CookieContext.Provider
      value={{
        prefs,
        accepted: prefs !== null,
        savePrefs,
        openBanner: () => setBannerOpen(true),
        bannerOpen,
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

export const useCookies = () => useContext(CookieContext)
