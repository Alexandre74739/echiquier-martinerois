import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { CookieBanner } from "@/src/components/layout/CookieBanner";
import { CookieProvider } from "@/src/components/providers/CookieProvider";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "L'Échiquier Martinérois — Club d'échecs à Saint-Martin-d'Hères",
    template: "%s | L'Échiquier Martinérois",
  },
  description:
    "Club d'échecs à Saint-Martin-d'Hères. Cours pour enfants, adolescents et adultes tous les mardis. Rejoignez notre communauté passionnée d'échecs.",
  keywords: [
    "échecs",
    "club",
    "Saint-Martin-d'Hères",
    "Grenoble",
    "cours",
    "tournois",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "L'Échiquier Martinérois",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-blanc text-noir antialiased">
        <CookieProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </CookieProvider>
      </body>
    </html>
  );
}
