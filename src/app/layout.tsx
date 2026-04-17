import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FarmFlow AI – Smart Farming App Generator",
  description:
    "AI-powered agent that understands your farming problem and instantly generates and deploys a custom app for it.",
  keywords: ["farming", "AI", "agriculture", "app generator", "smart farming"],
  openGraph: {
    title: "FarmFlow AI",
    description: "Describe your farming problem. Get a live app in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
