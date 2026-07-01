import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { Navbar } from "@/src/components/layout/Navbar";
import { Footer } from "@/src/components/layout/Footer";
import { CookieBanner } from "@/src/components/layout/CookieBanner";
import { CookieProvider } from "@/src/components/providers/CookieProvider";
import { BASE_URL } from "@/src/lib/config";

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
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | L'Échiquier Martinérois",
    default: "L'Échiquier Martinérois – Club d'échecs à Grenoble (SMH)",
  },
  description:
    "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours tous les mardis pour enfants, ados et adultes. Rejoignez L'Échiquier Martinérois !",
  keywords: [
    "club d'échecs",
    "Saint-Martin-d'Hères",
    "Grenoble",
    "SMH",
    "échecs",
    "cours d'échecs",
    "tournoi échecs",
    "Ligue Dauphiné-Savoie",
    "échecs enfants Grenoble",
  ],
  authors: [{ name: "L'Échiquier Martinérois" }],
  creator: "L'Échiquier Martinérois",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "L'Échiquier Martinérois",
    title:
      "L'Échiquier Martinérois — Club d'échecs à Saint-Martin-d'Hères (Grenoble)",
    description:
      "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours tous les mardis pour enfants, ados et adultes.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "L'Échiquier Martinérois — Club d'échecs à Saint-Martin-d'Hères",
    description:
      "Club d'échecs à Saint-Martin-d'Hères (Grenoble). Cours tous les mardis pour enfants, ados et adultes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${bebas.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-blanc text-noir antialiased">
        <MotionConfig reducedMotion="user">
          <CookieProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
          </CookieProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
