import type { Metadata } from "next";
import { Space_Grotesk, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { Showcase } from "@/components/three/Showcase";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AlgoRhythm — The science behind every hit",
  description:
    "Predict whether any Spotify track has the DNA of a chart hit — with SHAP-powered explanations of exactly which features drove the call.",
  openGraph: {
    title: "AlgoRhythm — The science behind every hit",
    description:
      "Paste a Spotify track. Get a hit probability and a breakdown of what makes it work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Providers>
          <CursorGlow />
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer accent={<Showcase name="disco" className="h-full" />} />
        </Providers>
      </body>
    </html>
  );
}
