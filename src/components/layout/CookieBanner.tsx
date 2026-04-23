"use client";

import { useState } from "react";
import { useCookies } from "@/src/components/providers/CookieProvider";

export function CookieBanner() {
  const { bannerOpen, savePrefs } = useCookies();
  const [detail, setDetail] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  if (!bannerOpen) return null;

  const acceptAll = () => savePrefs({ necessary: true, analytics: true });
  const refuseAll = () => savePrefs({ necessary: true, analytics: false });
  const saveCustom = () => savePrefs({ necessary: true, analytics });

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-noir border-t-4 border-red text-blanc shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {!detail ? (
          /* Vue simple */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <span
                className="text-red text-2xl shrink-0 mt-0.5"
                aria-hidden="true"
              >
                ♟
              </span>
              <p className="text-sm text-gris leading-relaxed">
                Ce site utilise des cookies strictement nécessaires à son
                fonctionnement. Avec votre accord, nous pouvons également
                mesurer l'audience pour améliorer votre expérience.{" "}
                <button
                  onClick={() => setDetail(true)}
                  className="text-red underline hover:no-underline"
                >
                  Personnaliser
                </button>
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={refuseAll}
                className="px-4 py-2 text-sm border border-gris text-gris hover:border-blanc hover:text-blanc transition-colors"
              >
                Refuser
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-red hover:bg-red-hover text-blanc font-semibold transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          /* Vue détaillée */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-red text-2xl" aria-hidden="true">
                ♟
              </span>
              <h2 className="font-display text-2xl tracking-wider">
                Gestion des cookies
              </h2>
            </div>

            <div className="space-y-3">
              {/* Nécessaires */}
              <div className="flex items-start justify-between gap-4 p-3 bg-gris-fonce">
                <div>
                  <p className="font-semibold text-sm">Cookies nécessaires</p>
                  <p className="text-xs text-gris mt-0.5">
                    Indispensables au fonctionnement du site (préférences
                    cookies). Toujours actifs.
                  </p>
                </div>
                <span className="text-xs text-gris shrink-0 mt-0.5">
                  Toujours actif
                </span>
              </div>

              {/* Analytiques */}
              <div className="flex items-center justify-between gap-4 p-3 bg-gris-fonce">
                <div>
                  <p className="font-semibold text-sm">Cookies analytiques</p>
                  <p className="text-xs text-gris mt-0.5">
                    Mesure d'audience anonyme pour améliorer le site.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red ${analytics ? "bg-red" : "bg-gris"}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-blanc rounded-full shadow transition-transform ${analytics ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={refuseAll}
                className="px-4 py-2 text-sm border border-gris text-gris hover:border-blanc hover:text-blanc transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={saveCustom}
                className="px-4 py-2 text-sm bg-red hover:bg-red-hover text-blanc font-semibold transition-colors"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
