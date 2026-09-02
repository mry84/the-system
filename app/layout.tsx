import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The System",
  description: "The System — institutional record of the night.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Nav />
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
