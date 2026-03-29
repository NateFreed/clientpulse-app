import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppTutorial from "@/components/AppTutorial";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClientPulse - AI-Powered Client Reports for Agencies",
  description: "White-label client dashboards with AI-generated insights. From $29/mo — 10x cheaper than DashThis.",
  openGraph: {
    title: "ClientPulse - AI Client Reports for Agencies",
    description: "White-label dashboards with AI insights. From $29/mo.",
    type: "website",
    siteName: "ClientPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientPulse - AI Client Reports for Agencies",
    description: "White-label dashboards with AI insights. From $29/mo.",
  },
  keywords: ["client reporting", "agency dashboard", "white-label analytics", "AI insights", "client portal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppTutorial />
        {children}
      </body>
    </html>
  );
}
