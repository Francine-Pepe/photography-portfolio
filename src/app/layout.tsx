import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.scss";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const alta = localFont({
  src: "./fonts/Alta_Regular.woff2",
  variable: "--font-alta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description:
    "A photography portfolio exploring people, nature, food, and everyday moments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className={`${alta.variable} `}>
        <Header />
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  );
}
