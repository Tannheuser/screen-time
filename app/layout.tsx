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
        <main className="min-h-dvh bg-slate-950 text-slate-200">
          <div className="min-h-dvh bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.18),transparent_35%),linear-gradient(180deg,#020617,#020617)] px-4 py-6">
            {children}
            <Analytics />
            <SpeedInsights />
          </div>
        </main>
      </body>
    </html>
  );
}
