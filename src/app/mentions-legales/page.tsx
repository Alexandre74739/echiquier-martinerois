import Link from 'next/link'

export const metadata = {
  title: 'Mentions légales & Politique de confidentialité',
  description: "Mentions légales, politique de confidentialité et informations RGPD du site de l'Échiquier Martinérois.",
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-blanc">
      <div className="bg-noir text-blanc py-20 relative overflow-hidden">
        <div className="absolute inset-0 chess-pattern opacity-[0.04]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl sm:text-7xl text-blanc">Mentions légales</h1>
          <p className="text-gris mt-4">Politique de confidentialité & RGPD</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:tracking-wide prose-h2:text-3xl prose-h3:text-xl prose-a:text-red prose-strong:text-noir">

          <Section titre="1. Éditeur du site">
            <p>
              <strong>Dénomination :</strong> L'Échiquier Martinérois<br />
              <strong>Forme juridique :</strong> Association loi 1901<br />
              <strong>Siège social :</strong> Place de la Liberté, 38400 Saint-Martin-d'Hères<br />
              <strong>Email :</strong>{' '}
              <a href="mailto:echiquier.martinerois@gmail.com">echiquier.martinerois@gmail.com</a><br />
              <strong>Président :</strong> Gabriel Guillon — 06 71 88 80 53
            </p>
          </Section>

          <Section titre="2. Hébergement">
            <p>
              Ce site est hébergé par <strong>Vercel Inc.</strong><br />
              340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </Section>

          <Section titre="3. Propriété intellectuelle">
            <p>
              L'ensemble du contenu de ce site (textes, images, logo, structure) est la propriété exclusive
              de l'association L'Échiquier Martinérois ou de ses membres. Toute reproduction, même partielle,
              est soumise à autorisation préalable écrite.
            </p>
            <p>
              Les puzzles d'échecs sont issus de la base de données{' '}
              <a href="https://lichess.org/training" target="_blank" rel="noopener noreferrer">Lichess</a>
              {' '}publiée sous licence Creative Commons CC0.
            </p>
            <p>
              Le moteur d'analyse Stockfish est distribué sous licence{' '}
              <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">GNU GPL v3</a>.
            </p>
          </Section>

          <Section titre="4. Données personnelles & RGPD">
            <h3>Responsable du traitement</h3>
            <p>L'association L'Échiquier Martinérois est responsable du traitement de vos données personnelles.</p>

            <h3>Données collectées</h3>
            <p>Via le formulaire de contact, nous collectons :</p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Contenu du message</li>
            </ul>
            <p>
              Ces données sont utilisées <strong>uniquement</strong> pour répondre à votre demande et ne sont jamais
              transmises à des tiers.
            </p>

            <h3>Base légale</h3>
            <p>Le traitement est fondé sur votre consentement explicite (art. 6.1.a du RGPD),
              donné lors de la soumission du formulaire.</p>

            <h3>Durée de conservation</h3>
            <p>Vos données sont conservées le temps nécessaire à la gestion de votre demande,
              puis supprimées dans un délai maximum de 12 mois.</p>

            <h3>Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Rectification</strong> : corriger des données inexactes</li>
              <li><strong>Effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Opposition</strong> : vous opposer au traitement</li>
              <li><strong>Portabilité</strong> : recevoir vos données dans un format lisible</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:echiquier.martinerois@gmail.com">echiquier.martinerois@gmail.com</a>.
              En cas de désaccord, vous pouvez saisir la{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </Section>

          <Section titre="5. Cookies">
            <p>Ce site utilise uniquement :</p>
            <ul>
              <li>
                <strong>Cookie de préférences</strong> (nécessaire) : stocké dans <code>localStorage </code>
                pour mémoriser vos choix de consentement. Aucune donnée n'est envoyée à des tiers.
              </li>
              <li>
                <strong>Cookies analytiques</strong> (optionnels) : mesure d'audience anonyme,
                activés uniquement avec votre accord.
              </li>
            </ul>
            <p>
              Vous pouvez modifier vos préférences à tout moment via le lien{' '}
              <Link href="/" className="text-red hover:underline">« Gérer mes cookies »</Link>
              {' '}en bas de chaque page.
            </p>
          </Section>

          <Section titre="6. Liens externes">
            <p>
              Ce site peut contenir des liens vers des sites externes (Lichess, FFE, Google Maps).
              L'Échiquier Martinérois n'est pas responsable du contenu de ces sites.
            </p>
          </Section>

          <Section titre="7. Loi applicable">
            <p>
              Le présent site et les présentes mentions légales sont soumis au droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </Section>

          <p className="text-sm text-gris mt-10 pt-6 border-t border-gris-clair">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-3xl text-noir border-l-4 border-red pl-4 mb-4">{titre}</h2>
      <div className="text-gris leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
