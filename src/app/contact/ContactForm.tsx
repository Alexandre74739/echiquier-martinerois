'use client'

import { useActionState } from 'react'

type FormState = { success: boolean; error: string | null } | null

async function sendEmail(_prev: FormState, formData: FormData): Promise<FormState> {
  const nom = formData.get('nom') as string
  const email = formData.get('email') as string
  const sujet = formData.get('sujet') as string
  const message = formData.get('message') as string
  const rgpd = formData.get('rgpd')
  const honeypot = formData.get('_trap') as string

  if (!rgpd) return { success: false, error: 'Vous devez accepter le traitement de vos données.' }
  if (!nom || !email || !message) return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, email, sujet, message, honeypot }),
    })
    const data = await res.json()
    if (!res.ok) return { success: false, error: data.error ?? "L'envoi a échoué." }
    return { success: true, error: null }
  } catch {
    return { success: false, error: "L'envoi a échoué. Veuillez réessayer ou nous contacter directement par email." }
  }
}

const sujets = [
  'Renseignements généraux',
  'Inscription au club',
  'Cours pour enfants',
  'Cours adultes',
  'Tournois et compétitions',
  'Autre',
]

export function ContactForm() {
  const [state, action, pending] = useActionState(sendEmail, null)

  if (state?.success) {
    return (
      <div className="bg-noir text-blanc p-8 text-center">
        <span className="text-6xl block mb-4" aria-hidden="true">♛</span>
        <h3 className="font-display text-3xl mb-3 text-red">Message envoyé !</h3>
        <p className="text-gris">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {/* Honeypot — caché aux humains, piège les bots */}
      <input
        type="text"
        name="_trap"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-semibold text-noir mb-1">
          Nom & prénom <span className="text-red" aria-hidden="true">*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          maxLength={100}
          className="w-full border border-gris-clair focus:border-red outline-none px-4 py-3 text-noir bg-blanc transition-colors"
          placeholder="Jean Dupont"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-noir mb-1">
          Email <span className="text-red" aria-hidden="true">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          className="w-full border border-gris-clair focus:border-red outline-none px-4 py-3 text-noir bg-blanc transition-colors"
          placeholder="jean@exemple.com"
        />
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="sujet" className="block text-sm font-semibold text-noir mb-1">
          Sujet
        </label>
        <select
          id="sujet"
          name="sujet"
          className="w-full border border-gris-clair focus:border-red outline-none px-4 py-3 text-noir bg-blanc transition-colors"
        >
          {sujets.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-noir mb-1">
          Message <span className="text-red" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          className="w-full border border-gris-clair focus:border-red outline-none px-4 py-3 text-noir bg-blanc transition-colors resize-none"
          placeholder="Votre message…"
        />
      </div>

      {/* RGPD */}
      <div className="flex items-start gap-3">
        <input
          id="rgpd"
          name="rgpd"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 accent-red shrink-0"
        />
        <label htmlFor="rgpd" className="text-sm text-gris leading-relaxed">
          J'accepte que mes données personnelles soient traitées par le club pour répondre à ma demande.
          Elles ne seront pas transmises à des tiers. Conformément au RGPD, vous pouvez exercer vos droits
          en nous contactant directement.{' '}
          <a href="/mentions-legales" className="text-red hover:underline">
            En savoir plus
          </a>
          {' '}<span className="text-red" aria-hidden="true">*</span>
        </label>
      </div>

      {/* Erreur */}
      {state?.error && (
        <div role="alert" className="bg-red/10 border border-red text-red px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      {/* Soumettre */}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-red hover:bg-red-hover disabled:opacity-50 text-blanc py-4 font-display text-xl tracking-wider transition-colors flex items-center justify-center gap-3 cursor-pointer"
      >
        {pending ? (
          <>
            <span className="animate-spin" aria-hidden="true">♞</span>
            Envoi en cours…
          </>
        ) : (
          <>
            <span aria-hidden="true">♞</span>
            Envoyer le message
          </>
        )}
      </button>

      <p className="text-xs text-gris text-center">
        <span className="text-red" aria-hidden="true">*</span> Champs obligatoires
      </p>
    </form>
  )
}
