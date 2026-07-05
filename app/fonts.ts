import { GeistSans } from "geist/font/sans";
import { JetBrains_Mono } from "next/font/google";

export const sans = GeistSans;

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
