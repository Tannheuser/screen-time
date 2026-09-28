import { getCurrentSession } from "@/lib/queries/current-session";

export const dynamic = "force-dynamic";

import { Circle, CircleDot, LockKeyhole, ShieldCheck } from "lucide-react";

export default async function Terminal() {
  const session = await getCurrentSession();
  if (!session) return <p className="p-5 text-cyan-200">No active mission.</p>;

  console.log(JSON.stringify(session))

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-md flex-col rounded-4xl">
      <div className="glass-panel rounded-3xl p-5">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/70">
              Active Mission
            </p>

            <h1 className="neon-text mt-3 font-mono text-3xl font-semibold uppercase tracking-[0.14em]">
              {session.title}
            </h1>

            <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-cyan-100/70">
              Status: {session.completedTasks > 0 ? "in progress" : "not started"}
            </p>
          </div>

          <div className="flex size-16 shrink-0 aspect-square items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/5 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
            <LockKeyhole className="size-7 text-cyan-200" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
            <span>Mission Progress</span>
            <span>{session.completedTasks} / {session.totalTasks}</span>
          </div>

          <div className="h-3 rounded-full border border-cyan-200/20 bg-black/30 p-0.5">
            <div style={{ width: `${session.completedTasks / session.totalTasks * 100}%` }} className="h-full rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-cyan-300/70">
            Access Code
          </p>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {session.digits.map((digit, index) => (
              <div
                key={index}
                className="neon-border flex aspect-square items-center justify-center rounded-xl border bg-black/20 font-mono text-4xl text-cyan-200"
              >
                {digit ?? "–"}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {session.challenges.map(({ position, title, status }) => (
            <div
              key={position}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 font-mono"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl text-cyan-300">{String(position).padStart(2, "0")}</span>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-cyan-100">
                    {title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-200/50">
                    {status}
                  </p>
                </div>
              </div>
              {status === "Completed" ? (
                <ShieldCheck className="size-5 text-cyan-300/70" />
              ) : status === "In progress" ? (
                <CircleDot className="size-5 text-cyan-300/70" />
              ) : (
                <Circle className="size-5 text-cyan-300/40" />
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
