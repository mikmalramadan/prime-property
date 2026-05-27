import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// next/font/google self-hosts Inter — no external network request at runtime
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prime Property — Properti Terbaik di Medan",
    template: "%s — Prime Property",
  },
  description:
    "Partner terpercaya Anda dalam menemukan properti impian. Ruko dan villa berkualitas di lokasi strategis Medan dan sekitarnya.",
  keywords: [
    "properti medan",
    "ruko medan",
    "villa medan",
    "prime property",
    "jual ruko",
    "jual villa",
  ],
  authors: [{ name: "Prime Property" }],
  creator: "Prime Property",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Prime Property",
    title: "Prime Property — Properti Terbaik di Medan",
    description:
      "Ruko dan villa berkualitas di lokasi strategis Medan dan sekitarnya.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1A1A1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
        <ToastProvider />
        <SpeedInsights />
      </body>
    </html>
  );
}
