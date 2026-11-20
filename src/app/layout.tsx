import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: every UK degree apprenticeship`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_GB" },
  twitter: { card: "summary" },
};

export const viewport: Viewport = { themeColor: "#0f1013", colorScheme: "dark" };

// Dark mode only: the `dark` class is fixed so shadcn's dark: variants always apply.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`dark ${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
