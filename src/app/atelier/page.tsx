import { fetchDailyPuzzle } from "@/src/lib/lichess";
import { AtelierClient } from "./AtelierClient";

export const metadata = {
  title: "Atelier",
  description:
    "Échiquier libre, puzzles par niveau et analyse Stockfish pour progresser aux échecs.",
};

export default async function AtelierPage() {
  const dailyPuzzle = await fetchDailyPuzzle().catch(() => null);

  return (
    <div className="bg-blanc min-h-screen">
      {/* En-tête */}
      <div className="bg-noir text-blanc py-16 relative overflow-hidden">
        <div className="absolute inset-0 chess-pattern opacity-[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase mb-4">
            Entraînement
          </span>
          <h1 className="font-display text-6xl sm:text-8xl text-blanc">
            Atelier
          </h1>
          <p className="text-gris mt-4 max-w-xl text-lg">
            Pratiquez librement sur notre échiquier interactif. Progressez avec
            des puzzles adaptés à votre niveau. Analysez vos coups avec
            Stockfish pour ne plus faire d'erreurs lors de vos parties d'échecs.
          </p>
        </div>
      </div>

      <AtelierClient dailyPuzzle={dailyPuzzle} />
    </div>
  );
}
