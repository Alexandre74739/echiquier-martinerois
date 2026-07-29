"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { NiveauPuzzle, LichessPuzzle } from "@/src/lib/lichess";
import { NiveauSelector } from "./_components/NiveauSelector";
import { boardOptions } from "./_components/boardOptions";

// ─── helpers ─────────────────────────────────────────────────────────────────

function uciMove(uci: string) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: (uci[4] as "q") ?? undefined,
  };
}

// ─── anti-doublon localStorage ────────────────────────────────────────────────

const SEEN_KEY = "puzzle_seen_v1";

function getSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function markSeen(id: string) {
  try {
    const arr = [...getSeenIds(), id].slice(-200);
    localStorage.setItem(SEEN_KEY, JSON.stringify(arr));
  } catch { /* ignore */ }
}

// ─── types ────────────────────────────────────────────────────────────────────

type Status = "loading" | "playing" | "correct" | "wrong" | "solved";

type MoveResult = "invalid" | "wrong" | "correct" | "solved";

const STATUS_BAR: Record<Status, { bg: string; label: string }> = {
  loading:  { bg: "bg-noir",      label: "Chargement…" },
  playing:  { bg: "bg-noir",      label: "À vous de jouer !" },
  correct:  { bg: "bg-green-700", label: "Bon coup — continuez !" },
  wrong:    { bg: "bg-red",       label: "Mauvais coup — réessayez" },
  solved:   { bg: "bg-green-700", label: "Bravo ! Puzzle résolu !" },
};

// ─── composant ───────────────────────────────────────────────────────────────

export function PuzzleClient() {
  const [niveau, setNiveau] = useState<NiveauPuzzle>("débutant");
  const [puzzle, setPuzzle] = useState<LichessPuzzle | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [moveIndex, setMoveIndex] = useState(1);
  const [status, setStatus] = useState<Status>("loading");
  const [orientation, setOrientation] = useState<"white" | "black">("white");

  // clic pour déplacer
  const [selected, setSelected] = useState<string | null>(null);
  // surbrillance dernier coup
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  // indice Stockfish
  const [hint, setHint] = useState<{ from: string; to: string } | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sfRef = useRef<Worker | null>(null);
  const loadPuzzleRef = useRef<(niv: NiveauPuzzle, attempt?: number) => void>(null as never);

  // Init Stockfish worker
  useEffect(() => {
    let w: Worker;
    try {
      w = new Worker("/stockfish.js");
      w.onerror = () => { sfRef.current = null; };
      w.postMessage("uci");
      sfRef.current = w;
    } catch { /* stockfish indisponible, hint utilisera la solution */ }
    return () => {
      w?.terminate();
      sfRef.current = null;
    };
  }, []);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  // ── chargement puzzle ───────────────────────────────────────────────────────

  const loadPuzzle = useCallback(
    async (niv: NiveauPuzzle, attempt = 0) => {
      clearTimer();
      setStatus("loading");
      setPuzzle(null);
      setGame(null);
      setSelected(null);
      setLastMove(null);
      setHint(null);
      setHintUsed(false);
      setHintLoading(false);

      try {
        const res = await fetch(`/api/puzzle?niveau=${niv}`);
        const data = await res.json();
        const p: LichessPuzzle | null = data.puzzle;

        // Puzzle null (Lichess indisponible) : auto-retry 3 fois puis abandon
        if (!p) {
          if (attempt < 3) {
            timerRef.current = setTimeout(() => loadPuzzleRef.current(niv, attempt + 1), 1200);
          } else {
            setStatus("playing"); // débloque le bouton "Nouveau puzzle"
          }
          return;
        }

        // anti-doublon : jusqu'à 4 essais (après 4 essais, on affiche quand même)
        if (attempt < 4 && getSeenIds().has(p.id)) {
          timerRef.current = setTimeout(() => loadPuzzleRef.current(niv, attempt + 1), 80);
          return;
        }

        markSeen(p.id);
        setPuzzle(p);

        // Le FEN inclut déjà le dernier coup adversaire (initialPly+1 coups joués)
        // solution[0] est le PREMIER coup du joueur — pas auto-joué
        const g = new Chess(p.fen);
        setGame(g);
        setOrientation(g.turn() === "w" ? "white" : "black");

        // Surligner le dernier coup adversaire pour le contexte
        if (p.opponentLastMove) {
          setLastMove({
            from: p.opponentLastMove.slice(0, 2),
            to: p.opponentLastMove.slice(2, 4),
          });
        }
        setMoveIndex(0);
        setStatus("playing");
      } catch { /* réseau indisponible */ }
    },
    [],
  );

  // Chargement initial + sync du ref récursif
  useEffect(() => {
    loadPuzzleRef.current = loadPuzzle;
    // setTimeout(0) rend l'appel asynchrone → setState ne se produit pas dans le corps synchrone de l'effet
    timerRef.current = setTimeout(() => loadPuzzle("débutant"), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── logique de coup ─────────────────────────────────────────────────────────

  const handleMove = useCallback(
    (from: string, to: string): MoveResult => {
      if (!game || !puzzle || status !== "playing") return "invalid";

      const expected = puzzle.moves[moveIndex];
      if (!expected) return "invalid";

      // Tenter le coup sur une copie
      const copy = new Chess(game.fen());
      let result: ReturnType<Chess["move"]>;
      try {
        result = copy.move({ from, to, promotion: "q" });
      } catch {
        return "invalid";
      }

      const played = result.from + result.to + (result.promotion ?? "");
      const isCorrect = played.slice(0, 4) === expected.slice(0, 4);

      setSelected(null);
      setHint(null);

      if (isCorrect) {
        setGame(copy);
        setLastMove({ from: result.from, to: result.to });

        const nextIdx = moveIndex + 1;

        if (nextIdx >= puzzle.moves.length) {
          // Puzzle terminé
          setStatus("solved");
          setMoveIndex(nextIdx);
          return "solved";
        }

        // Coup adversaire automatique
        setStatus("correct");
        setMoveIndex(nextIdx);

        timerRef.current = setTimeout(() => {
          const oppUci = puzzle.moves[nextIdx];
          const g2 = new Chess(copy.fen());
          const oppResult = g2.move(uciMove(oppUci));
          if (oppResult) {
            setGame(g2);
            setLastMove({ from: oppResult.from, to: oppResult.to });
          }
          setMoveIndex(nextIdx + 1);
          setStatus("playing");
        }, 600);

        return "correct";
      }

      // Mauvais coup
      setStatus("wrong");
      timerRef.current = setTimeout(() => {
        setGame(new Chess(game.fen())); // forcer le re-render sur la bonne position
        setStatus("playing");
      }, 700);

      return "wrong";
    },
    [game, puzzle, moveIndex, status],
  );

  // ── drag & drop ─────────────────────────────────────────────────────────────

  const onPieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare,
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      const r = handleMove(sourceSquare, targetSquare);
      return r === "correct" || r === "solved";
    },
    [handleMove],
  );

  // ── clic pour déplacer ──────────────────────────────────────────────────────

  const onSquareClick = useCallback(
    ({ square, piece }: { square: string; piece: { pieceType: string } | null }) => {
      if (status !== "playing" || !game) return;

      const isOwn =
        piece &&
        ((orientation === "white" && piece.pieceType.startsWith("w")) ||
          (orientation === "black" && piece.pieceType.startsWith("b")));

      if (selected) {
        if (selected === square) {
          setSelected(null);
          return;
        }
        const r = handleMove(selected, square);
        if (r === "invalid") {
          // pas un coup légal depuis selected : reselect si pièce propre
          setSelected(isOwn ? square : null);
        }
        // correct/wrong : handleMove a déjà appelé setSelected(null)
      } else if (isOwn) {
        setSelected(square);
      }
    },
    [selected, status, game, orientation, handleMove],
  );

  // ── indice Stockfish ────────────────────────────────────────────────────────

  const showHint = useCallback(() => {
    if (!game || !puzzle || status !== "playing" || hintLoading) return;

    const sf = sfRef.current;
    const expected = puzzle.moves[moveIndex];
    if (!expected) return;

    // Fallback direct si Stockfish indisponible
    if (!sf) {
      setHint({ from: expected.slice(0, 2), to: expected.slice(2, 4) });
      setHintUsed(true);
      return;
    }

    setHintLoading(true);
    const fen = game.fen();

    sf.onmessage = ({ data }: MessageEvent) => {
      if (typeof data !== "string") return;
      if (data.startsWith("bestmove")) {
        const m = data.match(/bestmove (\S+)/);
        if (m && m[1] !== "(none)") {
          setHint({ from: m[1].slice(0, 2), to: m[1].slice(2, 4) });
          setHintUsed(true);
        } else {
          // Stockfish n'a rien trouvé, utiliser la solution
          setHint({ from: expected.slice(0, 2), to: expected.slice(2, 4) });
          setHintUsed(true);
        }
        setHintLoading(false);
      }
    };

    sf.postMessage("stop");
    sf.postMessage(`position fen ${fen}`);
    sf.postMessage("go depth 10");
  }, [game, puzzle, moveIndex, status, hintLoading]);

  // ── styles des cases ────────────────────────────────────────────────────────

  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Dernier coup joué (jaune discret)
    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: "rgba(204,204,0,0.22)" };
      styles[lastMove.to] = { ...styles[lastMove.to], backgroundColor: "rgba(204,204,0,0.35)" };
    }

    // Case sélectionnée + coups légaux
    if (selected && game && status === "playing") {
      styles[selected] = { backgroundColor: "rgba(30,120,255,0.5)" };
      const legalDests = game.moves({ square: selected as never, verbose: true });
      for (const m of legalDests) {
        const hasPiece = !!game.get(m.to as never);
        styles[m.to] = hasPiece
          ? {
              backgroundColor: "rgba(30,120,255,0.15)",
              outline: "3px solid rgba(30,120,255,0.5)",
              outlineOffset: "-3px",
            }
          : {
              background:
                "radial-gradient(circle, rgba(30,120,255,0.45) 28%, transparent 28%)",
            };
      }
    }

    // Indice (orange)
    if (hint) {
      styles[hint.from] = { backgroundColor: "rgba(255,140,0,0.55)" };
      styles[hint.to] = { backgroundColor: "rgba(255,140,0,0.55)" };
    }

    return styles;
  }, [selected, game, hint, lastMove, status]);

  // ── rendu ───────────────────────────────────────────────────────────────────

  const bar = STATUS_BAR[status];
  const canInteract = status === "playing";
  const playerMoves = puzzle ? Math.ceil((puzzle.moves.length - 1) / 2) : 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Sélecteur de niveau */}
      <NiveauSelector
        niveau={niveau}
        onSelect={(n) => {
          setNiveau(n);
          loadPuzzle(n);
        }}
      />

      {/* Info : couleur + ID puzzle */}
      {puzzle && status !== "loading" && (
        <div className="w-full max-w-120 flex items-center justify-between bg-noir px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full border-2 border-gris shrink-0 ${
                orientation === "white" ? "bg-blanc" : "bg-gris-fonce"
              }`}
            />
            <span className="font-display text-sm tracking-wider text-blanc">
              Vous jouez les{" "}
              <span>{orientation === "white" ? "Blancs" : "Noirs"}</span>
            </span>
          </div>
          <span className="text-gris text-xs font-mono">
            #{puzzle.id} · {puzzle.rating} pts
          </span>
        </div>
      )}

      {/* Échiquier */}
      <div className="w-full max-w-120 relative">
        {status === "loading" && (
          <div className="absolute inset-0 bg-noir/80 z-10 flex items-center justify-center">
            <span className="text-red text-5xl animate-pulse" aria-hidden="true">
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
              allowDragging: canInteract,
              squareStyles,
              onPieceDrop,
              onSquareClick,
            }}
          />
        ) : (
          <div className="aspect-square bg-gris-clair flex items-center justify-center text-7xl text-gris">
            <span className="animate-pulse">♟</span>
          </div>
        )}
      </div>

      {/* Barre de statut */}
      <div
        className={`w-full max-w-120 px-5 py-3 flex items-center gap-3 transition-colors duration-200 ${bar.bg}`}
      >
        <span className="font-display tracking-wider text-sm text-blanc flex-1">
          {bar.label}
        </span>
        {status === "solved" && (
          <span className="text-xs text-blanc/60 font-mono">
            {hintUsed
              ? "avec indice"
              : `${playerMoves} coup${playerMoves > 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      {/* Thèmes (visibles une fois résolu) */}
      {puzzle && status === "solved" && puzzle.themes.length > 0 && (
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

      {/* Boutons d'action */}
      <div className="flex gap-2 w-full max-w-120">
        <button
          onClick={() => loadPuzzle(niveau)}
          className="cursor-pointer flex-1 bg-noir hover:bg-gris-fonce text-blanc px-4 py-3 font-display tracking-wider transition-colors text-sm"
        >
          {status === "loading" ? "⏳ Chargement…" : "♞ Nouveau puzzle"}
        </button>

        {status === "playing" && !hint && (
          <button
            onClick={showHint}
            disabled={hintLoading}
            className="cursor-pointer flex-1 bg-gris-clair hover:bg-gris hover:text-blanc text-noir px-4 py-3 font-display tracking-wider transition-colors text-sm disabled:opacity-60"
          >
            {hintLoading ? "⚙ Stockfish…" : "Indice"}
          </button>
        )}

        {status === "solved" && puzzle && (
          <a
            href={`https://lichess.org/training/${puzzle.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gris-clair hover:bg-gris hover:text-blanc text-noir px-4 py-3 font-display tracking-wider transition-colors text-sm text-center"
          >
            ♜ Voir sur Lichess
          </a>
        )}
      </div>
    </div>
  );
}
