import type { Metadata } from "next";

import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const jetbrainsMono = localFont({
  src: "../public/font/jetbrains-mono/jetbrains-mono-variable.ttf",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "FX Checker",
  description: "Foregin Currency Exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full scroll-smooth">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
