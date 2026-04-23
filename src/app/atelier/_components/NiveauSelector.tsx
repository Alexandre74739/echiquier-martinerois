import type { NiveauPuzzle } from "@/src/lib/lichess";

const niveaux: { value: NiveauPuzzle; label: string; icon: string }[] = [
  { value: "débutant", label: "Débutant", icon: "♙" },
  { value: "ado",      label: "Adolescent", icon: "♘" },
  { value: "adulte",   label: "Adulte",    icon: "♕" },
];

type Props = {
  niveau: NiveauPuzzle;
  onSelect: (n: NiveauPuzzle) => void;
};

export function NiveauSelector({ niveau, onSelect }: Props) {
  return (
    <div className="flex gap-2 w-full max-w-120">
      {niveaux.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`cursor-pointer flex-1 py-2.5 font-display text-sm tracking-wider transition-colors flex items-center justify-center gap-1.5
            ${niveau === value
              ? "bg-red text-blanc"
              : "bg-gris-clair text-noir hover:bg-gris hover:text-blanc"
            }`}
        >
          <span aria-hidden="true">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
