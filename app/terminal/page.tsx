import { LockKeyhole } from "lucide-react";

import { ProgressMeter } from "@/app/terminal/_components/progress-meter";
import { SessionChallengeLink } from "@/app/terminal/_components/session-challenge-link";
import { PanelHeader } from "@/components/panel-header";
import {
  deriveMissionStatus,
  formatChallengeStatus,
} from "@/lib/challenges/status";
import { getCurrentSession } from "@/lib/queries/current-session";

export const dynamic = "force-dynamic";

export default async function Terminal() {
  const session = await getCurrentSession();
  if (!session) return <p className="p-5 text-cyan-200">No active mission.</p>;
  const missionStatus = deriveMissionStatus(
    session.challenges.map((challenge) => challenge.status),
  );

  console.log("session", session);

  return (
    <section className="mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-md flex-col rounded-4xl">
      <div className="glass-panel rounded-3xl p-5">
        <PanelHeader
          eyebrow="Active Mission"
          title={session.title}
          subtitle={`Status: ${formatChallengeStatus(missionStatus)}`}
          icon={<LockKeyhole className="size-7" />}
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <ProgressMeter
            label="Mission Progress"
            value={session.completedTasks}
            max={session.totalTasks}
          />

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
          {session.challenges.map((challenge) => (
            <SessionChallengeLink key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

    </section>
  );
}
