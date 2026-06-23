import { getTournaments, getLatestPosts } from "@/src/lib/sanity/queries";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { BASE_URL } from "@/src/lib/config";

export const revalidate = 60;
import { Hero } from "./_sections/Hero";
import { InfosClub } from "./_sections/InfosClub";
import { SectionSEO } from "./_sections/SectionSEO";
import { SectionTournois } from "./_sections/SectionTournois";
import { SectionBlog } from "./_sections/SectionBlog";
import { SectionChiffres } from "./_sections/SectionChiffres";
import { SectionCTA } from "./_sections/SectionCTA";

export const metadata = {
  title: "Club d'échecs à Saint-Martin-d'Hères (Grenoble)",
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours pour enfants, ados et adultes tous les mardis. Rejoignez L'Échiquier Martinérois !",
  alternates: {
    canonical: BASE_URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Où se trouve le club d'échecs L'Échiquier Martinérois ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le club est situé Place de la Liberté à Saint-Martin-d'Hères (38400), dans l'agglomération grenobloise, entrée côté église.",
      },
    },
    {
      "@type": "Question",
      name: "Quels sont les horaires du club ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le club se réunit tous les mardis hors vacances scolaires : cours jeunes de 18h à 19h, cours adultes de 19h à 20h, jeu libre de 20h à 22h.",
      },
    },
    {
      "@type": "Question",
      name: "Comment rejoindre le club d'échecs de Saint-Martin-d'Hères ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contactez-nous par email à echiquier.martinerois@gmail.com ou venez directement le mardi soir Place de la Liberté. L'adhésion comprend la licence FFE.",
      },
    },
    {
      "@type": "Question",
      name: "Y a-t-il des cours d'échecs pour enfants à Grenoble ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, L'Échiquier Martinérois propose des cours d'échecs pour enfants dès 6 ans, tous les mardis de 18h à 19h à Saint-Martin-d'Hères.",
      },
    },
  ],
};

const clubJsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsClub", "LocalBusiness"],
  name: "L'Échiquier Martinérois",
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours pour enfants, ados et adultes tous les mardis.",
  url: "https://echiquier-martinerois.com",
  telephone: "+33671888053",
  email: "echiquier.martinerois@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Place de la Liberté",
    addressLocality: "Saint-Martin-d'Hères",
    postalCode: "38400",
    addressRegion: "Isère",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 45.1666,
    longitude: 5.7678,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Tuesday",
      opens: "18:00",
      closes: "22:00",
    },
  ],
  sport: "Chess",
  image: "https://echiquier-martinerois.com/logo.png",
  priceRange: "€",
  areaServed: [
    { "@type": "City", name: "Saint-Martin-d'Hères" },
    { "@type": "City", name: "Grenoble" },
  ],
};

export default async function HomePage() {
  const [tournois, articles] = await Promise.all([
    getTournaments(3).catch(() => []),
    getLatestPosts(3).catch(() => []),
  ]);

  return (
    <>
      <JsonLd data={clubJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Hero />
      <InfosClub />
      <SectionSEO />
      <SectionTournois tournois={tournois} />
      <SectionBlog articles={articles} />
      <SectionChiffres />
      <SectionCTA />
    </>
  );
}
