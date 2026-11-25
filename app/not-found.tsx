import type { Metadata } from "next";

import { Header } from "@/components/header";
import { NotFoundPanel } from "@/components/not-found-panel";

export const metadata: Metadata = {
  title: "Page not found | Screen Time",
};

export default function NotFound() {
  return (
    <>
      <Header missionName="unlock screen time" />
      <NotFoundPanel
        title="Page not found"
        message="Error 404"
        href="/"
        linkLabel="Return to Mission Hub"
      />
    </>
  );
}
