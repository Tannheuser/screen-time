import type { Metadata } from "next";

import { NotFoundPanel } from "@/components/not-found-panel";

export const metadata: Metadata = {
  title: "Challenge not found | Screen Time",
};

export default function NotFound() {
  return (
    <NotFoundPanel
      title="Challenge not found"
      message="Open the Mission Terminal to see your current challenges."
      href="/terminal"
      linkLabel="Back to Mission Terminal"
    />
  );
}
