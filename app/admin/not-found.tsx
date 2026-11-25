import type { Metadata } from "next";

import { Header } from "@/components/header";
import { NotFoundPanel } from "@/components/not-found-panel";

export const metadata: Metadata = {
  title: "Page not found | Screen Time",
};

export default function NotFound() {
  return (
    <>
      <Header missionName="mission control" />
      <NotFoundPanel
        title="Page not found"
        message="This page is missing from Mission Control."
        href="/admin"
        linkLabel="Back to Mission Control"
      />
    </>
  );
}
