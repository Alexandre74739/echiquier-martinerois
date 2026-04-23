import type { LichessPuzzle, NiveauPuzzle } from "@/src/lib/lichess";

type Props = {
  puzzle: LichessPuzzle;
  status: string;
  showSolution: boolean;
  niveau: NiveauPuzzle;
  onNewPuzzle: () => void;
  onReveal: () => void;
};

export function PuzzleInfo({
  puzzle,
  status,
  showSolution,
  onNewPuzzle,
  onReveal,
}: Props) {
  return (
    <>
      <div className="w-full max-w-[480px] bg-gris-clair p-4 text-sm text-gris">
        <div className="flex justify-between">
          <span>Puzzle #{puzzle.id}</span>
          <span>
            Évaluation : <strong className="text-noir">{puzzle.rating}</strong>
          </span>
        </div>
        {puzzle.themes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {puzzle.themes.slice(0, 4).map((t) => (
              <span key={t} className="text-xs bg-gris text-blanc px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 w-full max-w-[480px]">
        <button
          onClick={onNewPuzzle}
          className="flex-1 bg-noir hover:bg-gris-fonce text-blanc px-4 py-3 font-display tracking-wider transition-colors text-sm"
        >
          ♞ Nouveau puzzle
        </button>
        {status === "playing" && !showSolution && (
          <button
            onClick={onReveal}
            className="flex-1 border border-gris hover:border-blanc text-gris hover:text-blanc px-4 py-3 font-display tracking-wider transition-colors text-sm"
          >
            Voir la solution
          </button>
        )}
      </div>
    </>
  );
}
