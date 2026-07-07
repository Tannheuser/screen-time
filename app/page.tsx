import { ChevronRight, Cog, SquareTerminal } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/header";

export default async function Home() {
  const cardTitleClass = "font-mono neon-text flex gap-3 tracking-[0.14em]";

  return (
    <>
      <Header missionName="unlock screen time" />
      <section className="flex flex-col gap-4">
        <Card className="glass-panel rounded-[1.5rem]">
          <CardHeader>
            <CardTitle className={cardTitleClass}>
              <SquareTerminal />
              Mission Terminal
            </CardTitle>
            <CardDescription>
              Solve puzzles and recover the access code to earn extra screen
              time.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/terminal"
              className="neon-border flex w-full items-center justify-between rounded-xl border bg-cyan-300/5 px-5 py-4 font-mono text-sm uppercase tracking-[0.22em] text-cyan-200"
            >
              <span>&gt; Enter Terminal</span>
              <ChevronRight className="size-5" />
            </Link>
          </CardFooter>
        </Card>
        <Card className="glass-panel rounded-[1.5rem]">
          <CardHeader>
            <CardTitle className={cardTitleClass}>
              <Cog />
              Mission Control
            </CardTitle>
            <CardDescription>
              Configure missions, rewards, and monitor completed operations.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/admin"
              className="neon-border flex w-full items-center justify-between rounded-xl border bg-cyan-300/5 px-5 py-4 font-mono text-sm uppercase tracking-[0.22em] text-cyan-200"
            >
              <span>&gt; Open Console</span>
              <ChevronRight className="size-5" />
            </Link>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
