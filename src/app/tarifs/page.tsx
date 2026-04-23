import Link from "next/link";
import { getPricing } from "@/src/lib/sanity/queries";
import { PricingCards } from "./_components/PricingCards";
import { FFESection } from "./_components/FFESection";
import { FAQSection } from "./_components/FAQSection";

export const metadata = {
  title: "Tarifs & Licences",
  description:
    "Découvrez les tarifs d'adhésion au club d'échecs L'Échiquier Martinérois et les informations sur la licence FFE.",
};

export default async function TarifsPage() {
  const tarifsData = await getPricing().catch(() => null);

  return (
    <div className="bg-blanc">
      <div className="bg-noir text-blanc py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 chess-pattern opacity-[0.04]"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-red px-3 py-1 font-display text-sm tracking-[0.2em] text-blanc uppercase mb-4">
            Rejoindre le club
          </span>
          <h1 className="font-display text-6xl sm:text-8xl text-blanc">
            Tarifs
          </h1>
          <p className="text-gris mt-4 max-w-xl text-lg">
            Découvrez nos cotisations adaptées à tous. Votre premier cours au
            club est toujours gratuit. Contactez-nous pour obtenir votre tarif
            personnalisé selon votre catégorie.
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingCards data={tarifsData} />
        </div>
      </section>

      <FFESection />
      <FAQSection />

      <div className="bg-noir py-14 text-center">
        <p className="text-gris mb-6 text-lg">
          Vous avez une question sur les tarifs ?
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-blanc px-8 py-4 font-display text-xl tracking-wider transition-colors"
        >
          <span aria-hidden="true">♞</span>Nous contacter
        </Link>
      </div>
    </div>
  );
}
