import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chonkshakes.com.au"),
  title: {
    default: "Chonk — Australia's Highest-Protein Smoothie",
    template: "%s — Chonk",
  },
  description:
    "Up to 60g of protein per serve. Real fruit. Whey isolate. No shaker required. Built for people who actually train.",
  keywords: [
    "protein smoothie",
    "high protein",
    "gym",
    "Perth",
    "Australia",
    "post-workout",
    "chonk",
    "whey isolate",
  ],
  openGraph: {
    title: "Chonk — 60g of protein. Tastes like a reward.",
    description:
      "Australia's highest-protein smoothie bar. Real fruit, whey isolate, no added sugar.",
    siteName: "Chonk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chonk — 60g of protein. Tastes like a reward.",
    description:
      "Australia's highest-protein smoothie bar. Real fruit, whey isolate, no added sugar.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD8F3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <SmoothScroll />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
