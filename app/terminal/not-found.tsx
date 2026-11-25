import type { Metadata } from "next";

import { NotFoundPanel } from "@/components/not-found-panel";

export const metadata: Metadata = {
  title: "Page not found | Screen Time",
};

export default function NotFound() {
  return (
    <NotFoundPanel
      title="Page not found"
      message="This page is missing from the Mission Terminal."
      href="/terminal"
      linkLabel="Back to Mission Terminal"
    />
  );
}
