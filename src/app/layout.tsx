import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripWayz – Personalized Travel Planning Platform",
  description:
    "Design thoughtful journeys with curated destinations, transparent pricing, and shareable itineraries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <Providers>
          <div className="page-gradient min-h-screen">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
