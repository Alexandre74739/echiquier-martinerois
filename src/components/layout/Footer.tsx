"use client";

import Link from "next/link";
import { useCookies } from "@/src/components/providers/CookieProvider";

const piecesDecoratives = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];

export function Footer() {
  const { openBanner } = useCookies();

  return (
    <footer className="bg-noir text-blanc border-t-4 border-red">
      {/* Rangée de pièces décorative */}
      <div className="border-b border-gris-fonce">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-4 sm:gap-8">
          {piecesDecoratives.map((piece, i) => (
            <span
              key={i}
              className="text-2xl text-gris select-none"
              aria-hidden="true"
            >
              {piece}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Club */}
          <div>
            <h3 className="font-display text-2xl text-red mb-4 tracking-wider">
              L'Échiquier Martinérois
            </h3>
            <address className="not-italic text-gris text-sm space-y-1 leading-relaxed">
              <p>Place de la Liberté</p>
              <p>Saint-Martin-d'Hères</p>
              <p className="pt-1">(entrée côté église)</p>
              <p className="pt-3 font-semibold text-blanc">
                Mardis (hors vacances scolaires)
              </p>
              <p>18h00 – 22h00</p>
              <p className="text-xs text-gris mt-1">
                18h–19h réservé aux enfants
              </p>
            </address>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-display text-2xl text-red mb-4 tracking-wider">
              Navigation
            </h3>
            <nav>
              <ul className="space-y-2">
                {[
                  ["/", "Accueil"],
                  ["/tarifs", "Tarifs & licences"],
                  ["/tournois", "Tournois"],
                  ["/blog", "Blog"],
                  ["/atelier", "Atelier"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-gris hover:text-red transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="text-red group-hover:translate-x-1 transition-transform">
                        ›
                      </span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact & légal */}
          <div>
            <h3 className="font-display text-2xl text-red mb-4 tracking-wider">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-gris">
              <a
                href="mailto:echiquier.martinerois@gmail.com"
                className="block hover:text-red transition-colors"
              >
                echiquier.martinerois@gmail.com
              </a>
              <a
                href="tel:+33671888053"
                className="block hover:text-red transition-colors"
              >
                Gabriel Guillon / 06 71 88 80 53
              </a>
            </div>

            <div className="mt-6 pt-6 border-t border-gris-fonce space-y-2">
              <Link
                href="/mentions-legales"
                className="block text-xs text-gris hover:text-red transition-colors"
              >
                Mentions légales & Politique de confidentialité
              </Link>
              <button
                onClick={openBanner}
                className="block text-xs text-gris hover:text-red transition-colors cursor-pointer"
              >
                Gérer mes cookies
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gris-fonce flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gris">
          <p>
            © {new Date().getFullYear()} L'Échiquier Martinérois. Tous droits
            réservés.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-red" aria-hidden="true">
              ♞
            </span>
            <span>Fédération Française des Échecs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
