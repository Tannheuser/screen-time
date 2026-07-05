import {
  LockKeyhole,
  ShieldEllipsis,
  SquareTerminal,
  TerminalIcon,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="min-h-dvh max-w-md text-emerald-400 p-4">
      <section className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Mission Terminal</CardTitle>
            <CardDescription>
              Solve puzzles and recover the access code to earn extra screen
              time.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/terminal"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-500/10 px-5 py-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300 shadow-[0_0_24px_rgba(34,197,94,0.16)] transition hover:bg-emerald-500/20 active:scale-[0.99]"
            >
              <SquareTerminal className="size-4" />
              Enter Terminal
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">Mission Control</CardTitle>
            <CardDescription>
              Configure missions, rewards, and monitor completed operations.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/admin"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-500/10 px-5 py-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300 shadow-[0_0_24px_rgba(34,197,94,0.16)] transition hover:bg-emerald-500/20 active:scale-[0.99]"
            >
              <LockKeyhole className="size-4" />
              Open Console
            </Link>
          </CardFooter>
        </Card>
      </section>
    </main>
  );
}
