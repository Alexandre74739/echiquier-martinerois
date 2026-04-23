export function FFESection() {
  return (
    <section className="bg-gris-clair py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-6">
          <span className="text-6xl shrink-0 text-noir" aria-hidden="true">
            ♜
          </span>
          <div>
            <h2 className="font-display text-4xl text-noir mb-4 red-line">
              Licence FFE
            </h2>
            <p className="text-gris leading-relaxed mb-4">
              La{" "}
              <strong className="text-noir">
                Fédération Française des Échecs (FFE)
              </strong>{" "}
              délivre une licence annuelle permettant de participer aux tournois
              officiels, d'être classé Elo et de bénéficier d'une assurance lors
              des compétitions.
            </p>
            <p className="text-gris leading-relaxed mb-6">
              Besoin d'une licence FFE ? Nous nous occupons de tout. Le tarif
              dépendant de votre âge et des barèmes annuels de la fédération,
              n'hésitez pas à nous solliciter pour plus de précisions.
            </p>
            <a
              href="https://www.echecs.asso.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red font-display tracking-wider hover:underline"
            >
              <span aria-hidden="true">♟</span>Site de la FFE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
