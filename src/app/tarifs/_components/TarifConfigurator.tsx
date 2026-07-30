"use client"

import { useMemo, useState } from "react"
import { HelloAssoInscriptionButton } from "@/src/components/ui/HelloAssoInscriptionButton"
import type { HelloAssoMembershipForm, HelloAssoTier } from "@/src/lib/helloasso/client"

const CATEGORY_LABELS: Record<string, string> = {
  "Senior, S+, Vét": "Senior, S+, Vétéran",
  "U20 U18": "U18 – U20",
  "U8 U10 U12 U14 U16": "U8 – U16",
  "P.P.Handicape": "Personne en situation de handicap",
}

type CategoryGroup = {
  key: string
  label: string
  options: { licence: "A" | "B" | null; tier: HelloAssoTier }[]
}

type Residence = "interieur" | "exterieur"

/** Distingue les deux formulaires d'adhésion (résident / hors SMH). L'option "Cours" est portée par chaque tarif
    (extraOptions), pas par un formulaire dédié. */
function classifyForms(forms: HelloAssoMembershipForm[]) {
  const exterieur = forms.find((f) => /sport/i.test(f.title)) ?? null
  const interieur = forms.find((f) => f !== exterieur) ?? null
  return { interieur, exterieur }
}

/** Regroupe les tarifs d'un formulaire par catégorie (âge / statut), puis par licence A/B au sein de chaque catégorie. */
function groupTiers(tiers: HelloAssoTier[]): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>()
  for (const tier of tiers) {
    const cleaned = tier.label
      .replace(/^adhésion\s*-*\s*/i, "")
      .replace(/\b(martinerois|exterieur)\b\s*\+?\s*/gi, "")
      .replace(/\)\)/g, ")")
      .trim()

    const licenceMatch = cleaned.match(/licence\s*(a|b)/i)
    const licence = licenceMatch ? (licenceMatch[1].toUpperCase() as "A" | "B") : null
    /* On retire le connecteur "+" en même temps que "licence A/B" (une seule regex atomique)
       pour ne pas toucher aux "+" qui font partie d'une catégorie, comme "S+" (Senior Plus). */
    const key = cleaned
      .replace(/\s*\+?\s*licence\s*[ab]\s*/i, "")
      .replace(/[()]/g, "")
      .replace(/^[+-]\s*/, "")
      .replace(/\s+/g, " ")
      .trim() || "Standard"

    if (!groups.has(key)) groups.set(key, { key, label: CATEGORY_LABELS[key] ?? key, options: [] })
    groups.get(key)!.options.push({ licence, tier })
  }
  return Array.from(groups.values())
}

function formatEuros(cents: number): string {
  return `${cents / 100}€`
}

/** Nettoie le libellé HelloAsso pour l'affichage (espaces multiples, parenthèses doublées) sans en changer le contenu,
    afin que l'utilisateur reconnaisse la ligne exacte à choisir dans le formulaire HelloAsso. */
function cleanTierLabel(label: string): string {
  return label.replace(/\s+/g, " ").replace(/\)\)/g, ")").trim()
}

export function TarifConfigurator({ forms }: { forms: HelloAssoMembershipForm[] }) {
  const { interieur, exterieur } = useMemo(() => classifyForms(forms), [forms])

  const [residence, setResidence] = useState<Residence | null>(null)
  const [categoryKey, setCategoryKey] = useState<string | null>(null)
  const [licence, setLicence] = useState<"A" | "B" | null>(null)
  const [wantsCours, setWantsCours] = useState<boolean | null>(null)

  const needsResidenceStep = !!interieur && !!exterieur
  const selectedForm = needsResidenceStep
    ? (residence === "interieur" ? interieur : residence === "exterieur" ? exterieur : null)
    : (interieur ?? exterieur)

  const groups = useMemo(() => (selectedForm ? groupTiers(selectedForm.tiers) : []), [selectedForm])
  const selectedGroup = groups.find((g) => g.key === categoryKey) ?? (groups.length === 1 ? groups[0] : null)

  const needsCategoryStep = groups.length > 1
  const needsLicenceStep = !!selectedGroup && selectedGroup.options.length > 1

  const resultTier =
    selectedGroup?.options.find((o) => o.licence === licence)?.tier ?? selectedGroup?.options[0]?.tier ?? null
  const coursOption = resultTier?.extraOptions.find((o) => !o.isRequired) ?? null

  const step: "residence" | "categorie" | "licence" | "cours" | "resultat" =
    needsResidenceStep && !residence ? "residence"
    : !selectedForm ? "residence"
    : needsCategoryStep && !selectedGroup ? "categorie"
    : needsLicenceStep && !licence ? "licence"
    : coursOption && wantsCours === null ? "cours"
    : "resultat"

  const total = (resultTier?.price ?? 0) + (wantsCours && coursOption ? coursOption.price : 0)

  function reset() {
    setResidence(null)
    setCategoryKey(null)
    setLicence(null)
    setWantsCours(null)
  }

  return (
    <div className="max-w-xl mx-auto border-t-4 border-red bg-blanc shadow-sm p-8 sm:p-10">
      {/* Fil d'ariane des choix déjà faits */}
      {(residence || categoryKey || licence || wantsCours !== null) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          {residence && (
            <button
              type="button"
              onClick={() => { setResidence(null); setCategoryKey(null); setLicence(null); setWantsCours(null) }}
              className="bg-gris-clair/60 hover:bg-gris-clair px-3 py-1 font-display tracking-wide uppercase transition-colors cursor-pointer"
            >
              {residence === "interieur" ? "Saint-Martin-d'Hères" : "Hors Saint-Martin-d'Hères"} ✕
            </button>
          )}
          {selectedGroup && needsCategoryStep && (
            <button
              type="button"
              onClick={() => { setCategoryKey(null); setLicence(null) }}
              className="bg-gris-clair/60 hover:bg-gris-clair px-3 py-1 font-display tracking-wide uppercase transition-colors cursor-pointer"
            >
              {selectedGroup.label} ✕
            </button>
          )}
          {licence && needsLicenceStep && (
            <button
              type="button"
              onClick={() => setLicence(null)}
              className="bg-gris-clair/60 hover:bg-gris-clair px-3 py-1 font-display tracking-wide uppercase transition-colors cursor-pointer"
            >
              Licence {licence} ✕
            </button>
          )}
          {coursOption && wantsCours !== null && (
            <button
              type="button"
              onClick={() => setWantsCours(null)}
              className="bg-gris-clair/60 hover:bg-gris-clair px-3 py-1 font-display tracking-wide uppercase transition-colors cursor-pointer"
            >
              Cours : {wantsCours ? "Oui" : "Non"} ✕
            </button>
          )}
        </div>
      )}

      {step === "residence" && (
        <fieldset>
          <legend className="font-display text-2xl text-noir mb-6">Habitez-vous à Saint-Martin-d'Hères ?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {interieur && (
              <button
                type="button"
                onClick={() => setResidence("interieur")}
                className="min-h-20 flex items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center font-display text-noir transition-colors cursor-pointer"
              >
                Oui, j'habite Saint-Martin-d'Hères
              </button>
            )}
            {exterieur && (
              <button
                type="button"
                onClick={() => setResidence("exterieur")}
                className="min-h-20 flex items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center font-display text-noir transition-colors cursor-pointer"
              >
                Non, j'habite ailleurs
              </button>
            )}
          </div>
        </fieldset>
      )}

      {step === "categorie" && selectedForm && (
        <fieldset>
          <legend className="font-display text-2xl text-noir mb-6">Quelle est votre catégorie ?</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groups.map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setCategoryKey(g.key)}
                className="min-h-20 flex items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center font-display text-noir transition-colors cursor-pointer"
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === "licence" && selectedGroup && (
        <fieldset>
          <legend className="font-display text-2xl text-noir mb-2">Licence A ou B ?</legend>
          <p className="text-sm text-gris mb-6">Le prix inclut l'adhésion au club et la licence FFE choisie.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedGroup.options.map((o) => (
              <button
                key={o.licence}
                type="button"
                onClick={() => setLicence(o.licence)}
                className="min-h-32 flex flex-col items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center transition-colors cursor-pointer"
              >
                <span className="block font-display text-2xl text-noir">Licence {o.licence}</span>
                <span className="block text-xs text-gris mt-1">{o.tier.description}</span>
                <span className="block font-display text-xl text-red mt-2">{formatEuros(o.tier.price)}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {step === "cours" && coursOption && (
        <fieldset>
          <legend className="font-display text-2xl text-noir mb-2">Souhaitez-vous ajouter les cours ?</legend>
          <p className="text-sm text-gris mb-6">Facultatif : {coursOption.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setWantsCours(true)}
              className="min-h-24 flex flex-col items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center transition-colors cursor-pointer"
            >
              <span className="block font-display text-lg text-noir">Oui, j'ajoute les cours</span>
              <span className="block font-display text-xl text-red mt-2">+ {formatEuros(coursOption.price)}</span>
            </button>
            <button
              type="button"
              onClick={() => setWantsCours(false)}
              className="min-h-24 flex items-center justify-center border-2 border-gris-clair hover:border-noir p-4 text-center font-display text-noir transition-colors cursor-pointer"
            >
              Non merci
            </button>
          </div>
        </fieldset>
      )}

      {step === "resultat" && selectedForm && resultTier && (
        <div>
          <p className="text-sm font-display tracking-[0.2em] uppercase text-gris mb-1">Votre tarif</p>
          <h3 className="font-display text-3xl text-noir mb-1">Adhésion Échiquier Martinérois</h3>
          {selectedGroup && (
            <p className="text-sm text-gris mb-4">
              {residence === "interieur" ? "Saint-Martin-d'Hères" : "Hors Saint-Martin-d'Hères"}
              {needsCategoryStep ? ` — ${selectedGroup.label}` : ""}
              {licence ? ` — Licence ${licence}` : ""}
            </p>
          )}
          <div className="font-display text-5xl text-red mb-2">{formatEuros(total)}</div>
          {resultTier.description && <p className="text-sm text-gris mb-4">{resultTier.description}</p>}

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between border-b border-gris-clair pb-2">
              <span className="text-gris">Adhésion{licence ? ` + licence ${licence}` : ""}</span>
              <span className="text-noir text-lg font-display">{formatEuros(resultTier.price)}</span>
            </div>
            {wantsCours && coursOption && (
              <div className="flex justify-between border-b border-gris-clair pb-2">
                <span className="text-gris">Cours (option)</span>
                <span className="text-noir text-lg font-display">{formatEuros(coursOption.price)}</span>
              </div>
            )}
          </div>

          <div className="bg-gris-clair/40 border-l-4 border-red p-4 mb-4">
            <p className="text-sm font-display tracking-wide uppercase text-gris mb-1">
              Dans le formulaire, choisissez :
            </p>
            <p className="text-sm text-noir font-medium">« {cleanTierLabel(resultTier.label)} »</p>
            {wantsCours && coursOption && (
              <p className="text-sm text-noir font-medium mt-2">
                puis cochez l'option « {cleanTierLabel(coursOption.label)} »
              </p>
            )}
          </div>
          <HelloAssoInscriptionButton
            widgetUrl={selectedForm.widgetFullUrl}
            label="S'inscrire"
            className="block w-full text-center py-3 font-display tracking-wider bg-red hover:bg-red-hover text-blanc transition-colors cursor-pointer"
          />

          <button
            type="button"
            onClick={reset}
            className="w-full text-center text-sm text-gris hover:text-noir mt-4 underline cursor-pointer"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  )
}
