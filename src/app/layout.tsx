import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { Analytics } from "@vercel/analytics/next";
import CookieBanner from "@/components/layout/CookieBanner/CookieBanner";

const alta = localFont({
  src: "./fonts/Alta_Regular.woff2",
  variable: "--font-alta",
  display: "swap",
});

const cormorant = localFont({
  src: [
    {
      path: "./fonts/CormorantGaramond-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/CormorantGaramond-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description:
    "A photography portfolio exploring people, nature, food, and everyday moments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${alta.variable} ${cormorant.variable}`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
        <CookieBanner />
      </body>
    </html>
  );
}
