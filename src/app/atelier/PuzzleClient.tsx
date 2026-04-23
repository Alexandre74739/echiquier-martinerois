"use client";

import { useState, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { NiveauPuzzle, LichessPuzzle } from "@/src/lib/lichess";
import { NiveauSelector } from "./_components/NiveauSelector";
import { PuzzleInfo } from "./_components/PuzzleInfo";
import { boardOptions } from "./_components/boardOptions";

function uci(move: string) {
  return {
    from: move.slice(0, 2),
    to: move.slice(2, 4),
    promotion: move[4] as "q" | undefined,
  };
}

type Status = "playing" | "correct" | "wrong" | "solved";

const statusConfig: Record<Status, { bg: string; text: string; icon: string }> =
  {
    playing: { bg: "bg-noir", text: "text-gris", icon: "▸" },
    correct: { bg: "bg-green-700", text: "text-blanc", icon: "✓" },
    wrong: { bg: "bg-red", text: "text-blanc", icon: "✗" },
    solved: { bg: "bg-green-700", text: "text-blanc", icon: "♛" },
  };

const statusLabel: Record<Status, string> = {
  playing: "À votre tour de jouer !",
  correct: "Bon coup — continuez !",
  wrong: "Pas tout à fait — réessayez",
  solved: "Bravo ! Puzzle résolu !",
};

export function PuzzleClient({
  initialPuzzle,
}: {
  initialPuzzle: LichessPuzzle | null;
}) {
  const [niveau, setNiveau] = useState<NiveauPuzzle>("débutant");
  const [puzzle, setPuzzle] = useState<LichessPuzzle | null>(initialPuzzle);
  const [game, setGame] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<Status>("playing");
  const [loading, setLoading] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  useEffect(() => {
    if (!puzzle) return;
    const g = new Chess(puzzle.fen);
    if (puzzle.moves[0]) g.move(uci(puzzle.moves[0]));
    setGame(g);
    setMoveIndex(1);
    setStatus("playing");
    setShowSolution(false);
    setOrientation(g.turn() === "w" ? "white" : "black");
  }, [puzzle]);

  const loadPuzzle = useCallback(async (niv: NiveauPuzzle) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/puzzle?niveau=${niv}`);
      const data = await res.json();
      setPuzzle(data.puzzle);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    ({
      sourceSquare: from,
      targetSquare: to,
    }: {
      sourceSquare: string | null;
      targetSquare: string | null;
    }) => {
      if (
        !game ||
        !puzzle ||
        status !== "playing" ||
        showSolution ||
        !from ||
        !to
      )
        return false;
      const expected = puzzle.moves[moveIndex];
      if (!expected) return false;

      const copy = new Chess(game.fen());
      let result: ReturnType<Chess["move"]> | null = null;
      try {
        result = copy.move({ from, to, promotion: "q" });
      } catch {
        return false;
      }
      if (!result) return false;

      const played = from + to + (result.promotion ?? "");
      if (played.startsWith(expected.slice(0, 4))) {
        const next = moveIndex + 1;
        if (next >= puzzle.moves.length) {
          setGame(copy);
          setStatus("solved");
        } else {
          if (puzzle.moves[next]) copy.move(uci(puzzle.moves[next]));
          setGame(copy);
          setMoveIndex(next + 1);
          setStatus("correct");
          setTimeout(() => setStatus("playing"), 800);
        }
      } else {
        setGame(copy);
        setStatus("wrong");
        setTimeout(() => {
          setGame(new Chess(game.fen()));
          setStatus("playing");
        }, 900);
      }
      return true;
    },
    [game, puzzle, moveIndex, status, showSolution],
  );

  const revealSolution = () => {
    if (!puzzle || !game) return;
    const g = new Chess(puzzle.fen);
    for (const m of puzzle.moves) g.move(uci(m));
    setGame(g);
    setShowSolution(true);
    setStatus("solved");
  };

  const cfg = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-3">
      <NiveauSelector
        niveau={niveau}
        onSelect={(n) => {
          setNiveau(n);
          loadPuzzle(n);
        }}
      />

      {/* Contexte : qui joue + infos puzzle */}
      {puzzle && game && (
        <div className="w-full max-w-120 flex items-center justify-between bg-noir px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full border-2 border-gris shrink-0 ${orientation === "white" ? "bg-blanc" : "bg-gris-fonce"}`}
            />
            <span className="font-display text-sm tracking-wider text-blanc">
              Vous jouez les{" "}
              <strong>{orientation === "white" ? "Blancs" : "Noirs"}</strong>
            </span>
          </div>
          <span className="text-gris text-xs font-mono">
            #{puzzle.id} · {puzzle.rating} pts
          </span>
        </div>
      )}

      {/* Échiquier */}
      <div className="w-full max-w-120 relative">
        {loading && (
          <div className="absolute inset-0 bg-noir/75 z-10 flex items-center justify-center">
            <span
              className="text-red text-4xl animate-pulse"
              aria-hidden="true"
            >
              ♞
            </span>
          </div>
        )}
        {game ? (
          <Chessboard
            options={{
              ...boardOptions,
              position: game.fen(),
              boardOrientation: orientation,
              allowDragging: status === "playing" && !showSolution,
              onPieceDrop: onDrop,
            }}
          />
        ) : (
          <div className="h-96 bg-gris-clair flex items-center justify-center text-6xl text-gris">
            ♟
          </div>
        )}
      </div>

      {/* Barre de statut */}
      <div
        className={`w-full max-w-120 flex items-center gap-3 px-5 py-3 transition-colors ${cfg.bg}`}
      >
        <span
          className={`text-xl font-display shrink-0 ${cfg.text}`}
          aria-hidden="true"
        >
          {cfg.icon}
        </span>
        <span className={`font-display tracking-wider text-sm ${cfg.text}`}>
          {statusLabel[status]}
        </span>
        {status === "solved" && (
          <span className="ml-auto text-xs text-blanc/70 font-display tracking-wider">
            {showSolution
              ? "Solution affichée"
              : `${puzzle?.moves.length} coup${(puzzle?.moves.length ?? 0) > 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      {/* Thèmes du puzzle */}
      {puzzle && puzzle.themes.length > 0 && (
        <div className="w-full max-w-120 flex flex-wrap gap-1.5">
          {puzzle.themes.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-xs bg-gris-clair text-gris px-2 py-0.5 font-mono"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {puzzle && (
        <PuzzleInfo
          puzzle={puzzle}
          status={status}
          showSolution={showSolution}
          niveau={niveau}
          onNewPuzzle={() => loadPuzzle(niveau)}
          onReveal={revealSolution}
        />
      )}
    </div>
  );
}
