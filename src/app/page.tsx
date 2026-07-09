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
import { SectionFAQ } from "./_sections/SectionFAQ";

export const metadata = {
  title: {
    absolute: "L'Échiquier Martinérois – Club d'échecs à Grenoble (SMH)",
  },
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours pour enfants, ados et adultes tous les mardis. Rejoignez L'Échiquier Martinérois !",
  alternates: {
    canonical: BASE_URL,
  },
};

const faq = [
  {
    question: "Où se trouve le club d'échecs à Saint-Martin-d'Hères (Grenoble) ?",
    reponse:
      "Le club est situé Place de la Liberté à Saint-Martin-d'Hères (38400), entrée côté église, à quelques minutes du centre de Grenoble.",
  },
  {
    question: "Quels sont les horaires des cours d'échecs ?",
    reponse:
      "Le club se réunit tous les mardis hors vacances scolaires : cours jeunes de 18h à 19h, cours adultes de 19h à 22h.",
  },
  {
    question: "Faut-il déjà savoir jouer aux échecs pour s'inscrire ?",
    reponse:
      "Non, le club accueille aussi bien les grands débutants que les joueurs confirmés. Le premier cours est gratuit et sans engagement, quel que soit votre niveau.",
  },
  {
    question: "Quel est le tarif de la cotisation ?",
    reponse:
      "La cotisation varie selon l'âge et inclut la licence FFE. Le premier cours est gratuit ; le détail complet des tarifs est disponible sur notre page Tarifs.",
  },
  {
    question: "Comment inscrire son enfant au club d'échecs à Grenoble ?",
    reponse:
      "Les enfants sont acceptés dès 6 ans. Contactez-nous par email à echiquierm@gmail.com ou venez directement un mardi à 18h pour un cours découverte.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ question, reponse }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: reponse,
    },
  })),
};

const clubJsonLd = {
  "@context": "https://schema.org",
  "@type": ["SportsClub", "LocalBusiness"],
  name: "L'Échiquier Martinérois",
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours pour enfants, ados et adultes tous les mardis.",
  url: "https://echiquier-martinerois.com",
  telephone: "+33671888053",
  email: "echiquierm@gmail.com",
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
      <SectionFAQ items={faq} />
      <SectionCTA />
    </>
  );
}
