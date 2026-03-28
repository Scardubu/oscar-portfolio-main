import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "@/app/globals.css";
import { siteConfig } from "@/data/portfolio";

// ── Fonts ──────────────────────────────────────────────────────────────
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// JetBrains Mono served locally for best control
// Place the font files in /public/fonts/JetBrainsMono-*.woff2
const jetbrainsMono = localFont({
  src: [
    { path: "../../public/fonts/JetBrainsMono-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../../public/fonts/JetBrainsMono-Medium.woff2",   weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "Fira Code", "monospace"],
});

// ── Metadata ───────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase:  new URL(siteConfig.url),
  title:         { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description:   siteConfig.description,
  keywords:      ["Full-Stack Engineer", "AI Engineer", "ML Engineer", "Next.js", "Python", "SabiScore", "Nigeria", "Remote"],
  authors:       [{ name: siteConfig.name, url: siteConfig.url }],
  creator:       siteConfig.name,
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         siteConfig.url,
    title:       siteConfig.title,
    description: siteConfig.description,
    siteName:    siteConfig.name,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       siteConfig.title,
    description: siteConfig.description,
    images:      ["/og-image.png"],
    creator:     "@scardubu",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon:        [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple:       [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor:          [{ media: "(prefers-color-scheme: dark)", color: "#050507" }],
  colorScheme:         "dark",
  width:               "device-width",
  initialScale:        1,
  maximumScale:        5,
};

// ── Root Layout ────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={dmSans.className}>
        {/* Skip link — WCAG 2.4.1 */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        {children}

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background:  "var(--bg-elevated)",
              border:      "1px solid var(--border-default)",
              color:       "var(--text-primary)",
              fontFamily:  "var(--font-dm-sans, sans-serif)",
            },
          }}
        />
      </body>
    </html>
  );
}
