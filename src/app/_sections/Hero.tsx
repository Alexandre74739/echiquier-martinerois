import Image from "next/image";
import Link from "next/link";
import {
  IconCalendar,
  IconClock,
  IconLocation,
} from "@/src/components/ui/Icons";

const infoBar = [
  { Icon: IconCalendar, text: "Tous les mardis hors vacances scolaires" },
  { Icon: IconClock, text: "18h00 – 22h00 · Jeunes 18h–19h" },
  { Icon: IconLocation, text: "Place de la Liberté, Saint-Martin-d'Hères" },
];

export function Hero() {
  return (
    <section className="relative bg-noir min-h-screen flex flex-col overflow-hidden">
      {/* Fond diagonal */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-gris-fonce"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
        <div
          className="absolute right-0 top-0 h-full w-1/2 chess-pattern opacity-[0.05]"
          style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />
      </div>

      {/* Contenu */}
      <div className="relative flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center w-full">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-0.5 bg-red" />
              <span className="font-display text-base tracking-[0.35em] text-gris uppercase">
                Club d'échecs · Saint-Martin-d'Hères · Grenoble
              </span>
            </div>

            <h1 className="font-display leading-none">
              <span
                className="block text-blanc"
                style={{ fontSize: "clamp(3.5rem, 11vw, 8.5rem)" }}
              >
                L'Échiquier
              </span>
              <span
                className="block text-red"
                style={{ fontSize: "clamp(2.8rem, 9vw, 7rem)" }}
              >
                Martinérois
              </span>
            </h1>

            <div className="mt-6 w-16 h-1 bg-red" />
            <p className="mt-6 text-gris text-lg max-w-lg leading-relaxed">
              Cours d'échecs pour enfants, adolescents et adultes tous niveaux.
              Rejoignez une communauté passionnée chaque mardi soir.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-blanc px-8 py-4 font-display text-xl tracking-wider transition-colors animate-pulse-red"
              >
                <span aria-hidden="true">♞</span>Rejoindre le club
              </Link>
              <Link
                href="/atelier"
                className="inline-flex items-center gap-3 border-2 border-gris text-gris hover:border-blanc hover:text-blanc px-8 py-4 font-display text-xl tracking-wider transition-colors"
              >
                <span aria-hidden="true">♟</span>Atelier en ligne
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative w-72 h-80 xl:w-96 xl:h-[440px]">
              <Image
                src="/logo.png"
                alt="Logo L'Échiquier Martinérois"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barre infos */}
      <div className="relative border-t border-gris-fonce/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-center gap-6 sm:gap-10">
          {infoBar.map(({ Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-2 text-sm text-gris"
            >
              <Icon className="text-red shrink-0" size={15} />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
