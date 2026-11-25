import Link from "next/link";
import {
  ChevronRight,
  Circle,
  CircleDot,
  ShieldCheck,
} from "lucide-react";

import {
  formatChallengeStatus,
  type ChallengeStatus,
} from "@/lib/challenges/status";

type SessionChallengeLinkProps = {
  challenge: {
    id: string;
    position: number;
    title: string;
    status: ChallengeStatus;
  };
};

export function SessionChallengeLink({
  challenge,
}: SessionChallengeLinkProps) {
  const { id, position, title, status } = challenge;

  return (
    <Link
      href={`/terminal/challenges/${id}`}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/2.5 px-4 py-4 font-mono transition hover:border-cyan-300/30 hover:bg-cyan-300/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
      aria-label={`Open challenge ${position}: ${title}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-xl text-cyan-300">
          {String(position).padStart(2, "0")}
        </span>
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-cyan-100">
            {title}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-200/50">
            {formatChallengeStatus(status)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {status === "completed" ? (
          <ShieldCheck className="size-5 text-cyan-300/70" />
        ) : status === "in_progress" ? (
          <CircleDot className="size-5 text-cyan-300/70" />
        ) : (
          <Circle className="size-5 text-cyan-300/40" />
        )}
        <ChevronRight className="size-5 text-cyan-300/40 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
      </div>
    </Link>
  );
}
