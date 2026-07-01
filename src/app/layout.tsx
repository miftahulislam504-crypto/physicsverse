// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar }    from "@/components/layout/Navbar";
import { Toaster }   from "@/components/ui/Toaster";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";

// ─── Fonts ────────────────────────────────────────────────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets:  ["latin"],
  variable: "--font-space-grotesk",
  display:  "swap",
  weight:   ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets:  ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display:  "swap",
  weight:   ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-jetbrains-mono",
  display:  "swap",
  weight:   ["400", "500"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  "PhysicsVerse — See Physics. Feel Physics. Master Physics.",
    template: "%s | PhysicsVerse",
  },
  description:
    "Interactive simulations, AI tutoring, virtual labs, formula explorer, and a 3D science city — the complete physics learning ecosystem.",
  keywords: [
    "physics", "learning", "simulation", "virtual lab",
    "AI tutor", "mechanics", "quantum", "astrophysics",
    "HSC physics", "SSC physics", "physics olympiad",
  ],
  authors:  [{ name: "PhysicsVerse" }],
  creator:  "PhysicsVerse",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://physicsverse.app",
    siteName:    "PhysicsVerse",
    title:       "PhysicsVerse — Physics Learning Ecosystem",
    description: "See, feel, and master physics — interactive simulations, AI tutor, virtual labs.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:    "summary_large_image",
    title:   "PhysicsVerse",
    description: "The complete physics learning ecosystem.",
    images:  ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon:    [{ url: "/icons/icon-32.png", sizes: "32x32" }],
    apple:   [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#060d14" },
  ],
  width:            "device-width",
  initialScale:     1,
  maximumScale:     5,
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale   = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={[
        spaceGrotesk.variable,
        inter.variable,
        hindSiliguri.variable,
        jetbrainsMono.variable,
      ].join(" ")}
    >
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {/* Skip to content — accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg"
            >
              Skip to content
            </a>

            <Navbar />

            <main
              id="main-content"
              className="min-h-[calc(100vh-var(--navbar-height))]"
              style={{ paddingTop: "var(--navbar-height)" }}
            >
              {children}
            </main>

            <Toaster />
            <ServiceWorkerRegistration />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
