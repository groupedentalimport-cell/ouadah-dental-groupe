import type { Metadata } from "next";
import { DM_Sans, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "ODG - OUADAH DENTAL GROUPE | Équipements Dentaires Professionnels",
  description:
    "Distributeur exclusif d'équipements dentaires professionnels en Algérie depuis 2009. Fauteuils dentaires, unités, radiologie, stérilisation et plus.",
  keywords: [
    "ODG",
    "OUADAH DENTAL GROUPE",
    "dentaire",
    "équipement dentaire",
    "Algérie",
    "fauteuil dentaire",
    "stérilisation",
    "radiologie",
    "Oran",
  ],
  authors: [{ name: "OUADAH DENTAL GROUPE" }],
  robots: "index, follow",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "OUADAH DENTAL GROUPE — Équipements Dentaires Professionnels",
    description: "Distributeur exclusif d'équipements dentaires en Algérie. 48 wilayas, SAV réactif, installation et formation incluses.",
    type: "website",
    locale: "fr_DZ",
    alternateLocale: "ar_DZ",
    siteName: "OUADAH DENTAL GROUPE",
  },
  twitter: {
    card: "summary_large_image",
    title: "OUADAH DENTAL GROUPE — Équipements Dentaires",
    description: "Distributeur exclusif d'équipements dentaires en Algérie. SAV réactif.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cairo.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
