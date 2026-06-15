import type { Metadata, Viewport } from "next";
import { DM_Sans, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e3a5f",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ouadah-dental-groupe.vercel.app/"),
  title: {
    template: "%s | ODG - Ouadah Dental Groupe",
    default:
      "ODG - Ouadah Dental Groupe | Équipements Dentaires Professionnels en Algérie",
  },
  description:
    "Fournisseur leader d'équipements dentaires en Algérie depuis 2009. Fauteuils dentaires, unités, radiologie, stérilisation, instruments et consommables. Installation, formation et SAV.",
  keywords: [
    "dental equipment Algeria",
    "équipements dentaires Algérie",
    "fauteuil dentaire",
    "unité dentaire",
    "radiologie dentaire",
    "stérilisation",
    "ODG Oran",
    "OUADAH DENTAL GROUPE",
    "instruments dentaires",
    "consommables dentaires",
    "équipement cabinet dentaire",
    "installation dentaire Algérie",
  ],
  authors: [{ name: "OUADAH DENTAL GROUPE" }],
  creator: "OUADAH DENTAL GROUPE",
  publisher: "OUADAH DENTAL GROUPE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
  },
  alternates: {
    canonical: "https://ouadah-dental-groupe.vercel.app/",
  },
  openGraph: {
    title:
      "ODG - Ouadah Dental Groupe | Équipements Dentaires Professionnels en Algérie",
    description:
      "Fournisseur leader d'équipements dentaires en Algérie depuis 2009. Fauteuils dentaires, unités, radiologie, stérilisation, instruments et consommables.",
    type: "website",
    locale: "fr_DZ",
    alternateLocale: "ar_DZ",
    siteName: "ODG - Ouadah Dental Groupe",
    url: "https://ouadah-dental-groupe.vercel.app/",
    images: [
      {
        url: "/images/hero-dental.jpg",
        width: 1200,
        height: 630,
        alt: "ODG - Ouadah Dental Groupe | Équipements Dentaires Professionnels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "ODG - Ouadah Dental Groupe | Équipements Dentaires Professionnels",
    description:
      "Fournisseur leader d'équipements dentaires en Algérie. Installation, formation et SAV inclus.",
    images: ["/images/hero-dental.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OUADAH DENTAL GROUPE (ODG)",
  url: "https://ouadah-dental-groupe.vercel.app/",
  logo: "https://ouadah-dental-groupe.vercel.app/logo.svg",
  description:
    "Fournisseur leader d'équipements dentaires en Algérie depuis 2009. Fauteuils dentaires, unités, radiologie, stérilisation, instruments et consommables. Installation, formation et SAV.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Oran",
    addressCountry: "DZ",
    addressRegion: "Oran",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+213-541-000-000",
    contactType: "sales",
    availableLanguage: ["French", "Arabic"],
  },
  sameAs: [
    "https://www.facebook.com/ouadahdentalgroupe",
    "https://www.instagram.com/ouadah_dental_groupe",
  ],
  foundingDate: "2009",
  areaServed: {
    "@type": "Country",
    name: "Algeria",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ODG" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${cairo.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
