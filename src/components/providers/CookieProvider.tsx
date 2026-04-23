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

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<CookiePrefs | null>(null)
  const [bannerOpen, setBannerOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-prefs')
    if (stored) {
      setPrefs(JSON.parse(stored))
    } else {
      setBannerOpen(true)
    }
  }, [])

  const savePrefs = (p: CookiePrefs) => {
    localStorage.setItem('cookie-prefs', JSON.stringify(p))
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
