"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { LichessPuzzle } from "@/src/lib/lichess";

const ChessBoardClient = dynamic(
  () =>
    import("./ChessBoardClient").then((m) => ({ default: m.ChessBoardClient })),
  { ssr: false, loading: () => <BoardPlaceholder /> },
);
const PuzzleClient = dynamic(
  () => import("./PuzzleClient").then((m) => ({ default: m.PuzzleClient })),
  { ssr: false, loading: () => <BoardPlaceholder /> },
);
const StockfishClient = dynamic(
  () =>
    import("./StockfishClient").then((m) => ({ default: m.StockfishClient })),
  { ssr: false, loading: () => <BoardPlaceholder /> },
);

function BoardPlaceholder() {
  return (
    <div className="h-64 flex items-center justify-center">
      <span className="text-5xl animate-pulse text-red" aria-hidden="true">
        ♞
      </span>
    </div>
  );
}

type Tab = "echiquier" | "puzzles" | "analyse";

const TABS: { id: Tab; icon: string; label: string; sub: string }[] = [
  { id: "echiquier", icon: "♟", label: "Échiquier", sub: "Jeu libre" },
  { id: "puzzles", icon: "♞", label: "Puzzles", sub: "Entraînement" },
  { id: "analyse", icon: "♜", label: "Analyse", sub: "Stockfish 18" },
];

export function AtelierClient({
  dailyPuzzle,
}: {
  dailyPuzzle: LichessPuzzle | null;
}) {
  const [tab, setTab] = useState<Tab>("puzzles");

  return (
    <div>
      {/* Barre d'onglets */}
      <div className="bg-noir border-b border-gris-fonce">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`cursor-pointer group flex flex-col items-center gap-0.5 px-6 py-4 font-display tracking-wider transition-all border-b-2 ${
                  tab === t.id
                    ? "border-red text-blanc"
                    : "border-transparent text-gris hover:text-blanc hover:border-gris"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {t.icon}
                </span>
                <span className="text-sm">{t.label}</span>
                <span className="text-xs text-gris font-sans tracking-normal">
                  {t.sub}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet actif */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tab === "echiquier" && (
          <section>
            <SectionHeader
              icon="♟"
              title="Échiquier libre"
              desc="Déplacez les pièces librement — idéal pour analyser des positions ou préparer une partie."
            />
            <ChessBoardClient />
          </section>
        )}

        {tab === "puzzles" && (
          <section>
            <SectionHeader
              icon="♞"
              title="Puzzles"
              desc="Choisissez votre niveau et résolvez des puzzles sélectionnés depuis la base Lichess (licence CC0)."
            />
            <PuzzleClient initialPuzzle={dailyPuzzle} />
          </section>
        )}

        {tab === "analyse" && (
          <section>
            <SectionHeader
              icon="♜"
              title="Analyse Stockfish"
              desc="Moteur Stockfish 18 (version allégée) exécuté dans votre navigateur — aucune donnée envoyée."
            />
            <StockfishClient />
          </section>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <span className="text-4xl text-red shrink-0 mt-1" aria-hidden="true">
        {icon}
      </span>
      <div>
        <h2 className="font-display text-3xl text-noir">{title}</h2>
        <p className="text-gris text-sm mt-1 max-w-xl">{desc}</p>
      </div>
    </div>
  );
}
