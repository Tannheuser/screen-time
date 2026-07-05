import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { sans, mono } from "@/app/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screen Time",
  description:
    "Next.js starter with Supabase Auth, Postgres, Drizzle, Tailwind, shadcn/ui, and Zod.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        suppressHydrationWarning
        className={`min-h-full flex flex-col ${sans.variable} ${mono.variable}`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
