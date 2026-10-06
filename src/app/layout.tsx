import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { isDemoMode } from "@/lib/runtime";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "FonsFamily — Every Token Has a Brain", template: "%s — FonsFamily" },
  description: "Launch autonomous tokens with transparent AI minds and deterministic on-chain controls.",
  openGraph: {
    title: "FonsFamily — Every Token Has a Brain",
    description: "Launch. Think. Trade. Evolve.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const demoMode = isDemoMode();
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable}`}>
        <Nav demoMode={demoMode} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
