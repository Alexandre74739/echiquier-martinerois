"use client";

import { useCookies } from "@/src/components/providers/CookieProvider";

export function CookieBanner() {
  const { bannerOpen, savePrefs } = useCookies();

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-noir border-t-4 border-red text-blanc shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span
              className="text-red text-2xl shrink-0 mt-0.5"
              aria-hidden="true"
            >
              ♟
            </span>
            <p className="text-sm text-gris leading-relaxed">
              Ce site utilise uniquement des cookies strictement nécessaires à
              son fonctionnement (mémorisation de vos préférences d&apos;affichage).
              Aucun cookie de suivi ou de mesure d&apos;audience n&apos;est utilisé.
            </p>
          </div>
          <div className="shrink-0">
            <button
              onClick={() => savePrefs({ necessary: true })}
              className="px-4 py-2 text-sm bg-red hover:bg-red-hover text-blanc font-semibold transition-colors"
            >
              J&apos;ai compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
