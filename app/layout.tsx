import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import AuthProvider from "@/components/AuthProvider";
import { connectDB } from "@/lib/db";
import BrandSettings from "@/models/BrandSettings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Guidelines",
  description: "Brand identity guidelines and design assets.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch brand colors once, server-side, for the entire app
  let primaryColor = "#1d6497";
  let secondaryColor = "#f59e0b";

  try {
    await connectDB();
    const settings = await BrandSettings.findOne({}).lean<{
      primaryColor: string;
      secondaryColor: string;
    }>();
    if (settings) {
      primaryColor = settings.primaryColor;
      secondaryColor = settings.secondaryColor;
    }
  } catch {}

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global brand CSS variables */}
        <style>{`
          :root {
            --brand-primary:   ${primaryColor};
            --brand-secondary: ${secondaryColor};
          }
        `}</style>

        {/* ── Persistent site header ──────────────────────── */}
        <header style={{ backgroundColor: primaryColor }}>
          <div className="max-w-6xl mx-auto px-8 md:px-16 py-4 flex items-center">
            <Link
              href="/"
              className="text-white font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              Brand Guidelines
            </Link>
          </div>
        </header>

        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
