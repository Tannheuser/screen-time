"use client";

import { LockKeyhole, Play, Radar } from "lucide-react";

type SessionProps = {
  agentName?: string;
  missionName: string;
  recoveredDigits: Array<string | null>;
  totalTasks: number;
  completedTasks: number;
};

export function SessionCard({
  agentName = "Agent",
  missionName,
  recoveredDigits,
  totalTasks,
  completedTasks,
}: SessionProps) {
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <section className="rounded-3xl border border-emerald-500/25 bg-black/60 p-5 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500/70">
            // Session found
          </p>

          <h2 className="mt-2 font-mono text-2xl font-semibold uppercase tracking-[0.12em] text-emerald-300">
            {missionName}
          </h2>

          <p className="mt-2 text-sm text-emerald-500/60">
            Welcome back, {agentName}. Operation is still active.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3">
          <Radar className="size-6 text-emerald-400" />
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-500/70">
            Mission progress
          </span>

          <span className="font-mono text-xs text-emerald-300">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-emerald-950">
          <div
            className="h-full rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-emerald-500/70">
          // Recovered digits
        </p>

        <div className="grid grid-cols-4 gap-3">
          {recoveredDigits.map((digit, index) => (
            <div
              key={index}
              className="flex aspect-square items-center justify-center rounded-2xl border border-emerald-500/30 bg-black font-mono text-4xl font-bold text-emerald-300 shadow-[inset_0_0_20px_rgba(34,197,94,0.08)]"
            >
              {digit ?? "–"}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/15 bg-black/40 p-4">
        <LockKeyhole className="mt-0.5 size-5 shrink-0 text-emerald-400" />

        <p className="text-sm leading-6 text-emerald-500/70">
          Complete the remaining challenges to recover the full access code.
        </p>
      </div>

      <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-emerald-400 bg-emerald-500/10 px-5 py-4 font-mono text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300 shadow-[0_0_24px_rgba(34,197,94,0.16)] transition hover:bg-emerald-500/20 active:scale-[0.99]">
        <Play className="size-4" />
        Continue mission
      </button>
    </section>
  );
}
