import { ContactForm } from './ContactForm'
import { ContactInfos } from './_components/ContactInfos'

export const metadata = {
  title: 'Contact',
  description: "Contactez le club d'échecs L'Échiquier Martinérois pour toute question sur les cours, la cotisation ou les tournois.",
}

export default function ContactPage() {
  return (
    <div className="bg-blanc">
      <div className="bg-noir text-blanc py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 chess-pattern opacity-[0.04]"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase mb-4">
            Nous joindre
          </span>
          <h1 className="font-display text-6xl sm:text-8xl text-blanc">
            Contact
          </h1>
          <p className="text-gris mt-4 max-w-xl text-lg">
            Une question sur nos cours, nos tarifs ou les tournois ? Nous sommes
            à votre écoute pour vous aider. Écrivez-nous dès maintenant pour
            rejoindre le club.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
          <ContactInfos />
          <div>
            <h2 className="font-display text-4xl text-noir red-line mb-8">
              Envoyer un message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
