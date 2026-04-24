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
    default: "chonk. — 50 grams closer.",
    template: "%s — chonk.",
  },
  description:
    "The high-protein smoothie for people chasing something. 50g of whey-forward protein, real food, zero compromise on taste. Launching soon in Perth.",
  keywords: [
    "protein smoothie",
    "high protein",
    "whey isolate",
    "Perth",
    "Australia",
    "post-workout",
    "chonk",
    "fresh-made smoothie",
  ],
  openGraph: {
    title: "chonk. — 50 grams closer.",
    description:
      "The high-protein smoothie for people chasing something. 50g of whey-forward protein, zero compromise on taste. Launching soon in Perth.",
    siteName: "chonk.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "chonk. — 50 grams closer.",
    description:
      "The high-protein smoothie for people chasing something. 50g of whey-forward protein, zero compromise on taste. Launching soon in Perth.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2B8CC",
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
