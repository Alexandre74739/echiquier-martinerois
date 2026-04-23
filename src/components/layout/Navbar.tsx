'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const liens = [
  { href: '/', label: 'Accueil' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/tournois', label: 'Tournois' },
  { href: '/blog', label: 'Blog' },
  { href: '/atelier', label: 'Atelier' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <header className="bg-noir text-blanc sticky top-0 z-50 border-b-4 border-red">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setMenuOuvert(false)}>
            <div className="relative w-10 h-12 shrink-0">
              <Image
                src="/logo.png"
                alt="Logo L'Échiquier Martinérois"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="block font-display text-lg leading-none text-gris tracking-wider">
                échiquier
              </span>
              <span className="block font-display text-2xl leading-none text-blanc group-hover:text-red transition-colors">
                Martinérois
              </span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <ul className="hidden md:flex items-center gap-1">
            {liens.map(({ href, label }) => {
              const actif = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-4 py-2 font-display text-lg tracking-wider transition-colors relative group
                      ${actif ? 'text-red' : 'text-blanc hover:text-red'}`}
                  >
                    {label}
                    {actif && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-red" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Bouton burger mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 group"
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOuvert}
          >
            <span className={`w-6 h-0.5 bg-blanc transition-all ${menuOuvert ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-blanc transition-all ${menuOuvert ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-blanc transition-all ${menuOuvert ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div className="md:hidden border-t border-gris-fonce pb-4">
            <ul className="flex flex-col gap-1 pt-2">
              {liens.map(({ href, label }) => {
                const actif = href === '/' ? pathname === '/' : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMenuOuvert(false)}
                      className={`block px-4 py-3 font-display text-xl tracking-wider border-l-4 transition-colors
                        ${actif
                          ? 'border-red text-red bg-gris-fonce'
                          : 'border-transparent text-blanc hover:border-red hover:text-red'
                        }`}
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
