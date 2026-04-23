import { getTournaments, getLatestPosts } from "@/src/lib/sanity/queries";

export const revalidate = 60;
import { Hero } from "./_sections/Hero";
import { InfosClub } from "./_sections/InfosClub";
import { SectionSEO } from "./_sections/SectionSEO";
import { SectionTournois } from "./_sections/SectionTournois";
import { SectionBlog } from "./_sections/SectionBlog";
import { SectionChiffres } from "./_sections/SectionChiffres";
import { SectionCTA } from "./_sections/SectionCTA";

export const metadata = {
  title: "L'Échiquier Martinérois — Club d'échecs à Saint-Martin-d'Hères",
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours pour enfants, ados et adultes tous les mardis. Rejoignez L'Échiquier Martinérois !",
};

export default async function HomePage() {
  const [tournois, articles] = await Promise.all([
    getTournaments(3).catch(() => []),
    getLatestPosts(3).catch(() => []),
  ]);

  return (
    <>
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
