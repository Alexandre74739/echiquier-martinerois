import type { LichessPuzzle, NiveauPuzzle } from "@/src/lib/lichess";

type Props = {
  puzzle: LichessPuzzle;
  status: string;
  showSolution: boolean;
  niveau: NiveauPuzzle;
  onNewPuzzle: () => void;
  onReveal: () => void;
};

export function PuzzleInfo({ status, showSolution, onNewPuzzle, onReveal }: Props) {
  return (
    <div className="flex gap-2 w-full max-w-120">
      <button
        onClick={onNewPuzzle}
        className="cursor-pointer flex-1 bg-noir hover:bg-gris-fonce text-blanc px-4 py-3 font-display tracking-wider transition-colors text-sm"
      >
        ♞ Nouveau puzzle
      </button>
      {status === "playing" && !showSolution && (
        <button
          onClick={onReveal}
          className="cursor-pointer flex-1 bg-gris-clair hover:bg-gris hover:text-blanc text-noir px-4 py-3 font-display tracking-wider transition-colors text-sm"
        >
          Voir la solution
        </button>
      )}
    </div>
  );
}
