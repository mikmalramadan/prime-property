import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font/google self-hosts Inter — no external network request at runtime
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Property",
  description: "Discover premier properties with Prime Property — your trusted real estate partner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
