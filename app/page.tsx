import Link from "next/link";
import { ChevronRight, Cog, RadioTower, SquareTerminal } from "lucide-react";

import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
      <Header missionName="unlock screen time" />
      <section className="mx-auto flex min-h-[calc(100dvh-5.75rem)] w-full max-w-md">
        <div className="glass-panel w-full flex-1 rounded-3xl p-5">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/70">
                System online
              </p>
              <h1 className="neon-text mt-3 font-mono text-3xl font-semibold uppercase tracking-[0.14em]">
                Mission Hub
              </h1>
            </div>

            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/5 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
              <RadioTower className="size-7 text-cyan-200" />
            </div>
          </div>

          <div className="grid grid-rows-2 gap-3">
            <Link
              href="/terminal"
              className="group flex h-full items-center justify-between rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 transition hover:border-cyan-300/30 hover:bg-cyan-300/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/5">
                  <SquareTerminal className="size-5 text-cyan-200" />
                </div>
                <div>
                  <h2 className="font-mono text-sm uppercase tracking-[0.16em] text-cyan-100">
                    Mission Terminal
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-cyan-100/50">
                    Solve challenges and recover the code.
                  </p>
                </div>
              </div>
              <ChevronRight className="ml-3 size-5 shrink-0 text-cyan-300/40 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
            </Link>

            <Link
              href="/admin"
              className="group flex h-full items-center justify-between rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 transition hover:border-cyan-300/30 hover:bg-cyan-300/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/5">
                  <Cog className="size-5 text-cyan-200" />
                </div>
                <div>
                  <h2 className="font-mono text-sm uppercase tracking-[0.16em] text-cyan-100">
                    Mission Control
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-cyan-100/50">
                    Configure missions, rewards, and progress.
                  </p>
                </div>
              </div>
              <ChevronRight className="ml-3 size-5 shrink-0 text-cyan-300/40 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
