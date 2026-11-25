import { ChevronRight, Telescope } from "lucide-react";
import Link from "next/link";

type NotFoundPanelProps = {
  title: string;
  message: string;
  href: string;
  linkLabel: string;
};

export function NotFoundPanel({ title, message, href, linkLabel }: NotFoundPanelProps) {
  return (
    <section className="glass-panel mx-auto flex min-h-[calc(100dvh-5.75rem)] w-full max-w-md flex-col rounded-3xl p-5">
      <div className="flex flex-1 flex-col rounded-2xl border border-white/10 p-4">
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_32px_rgba(34,211,238,0.18)]">
            <Telescope aria-hidden="true" className="size-10 text-cyan-200" />
          </div>
          <h1 className="neon-text mt-6 font-mono text-2xl uppercase tracking-[0.14em]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-cyan-100/60">{message}</p>
        </div>
        <Link
          href={href}
          className="neon-border mt-6 flex w-full items-center justify-between gap-2 rounded-xl border bg-cyan-300/10 px-5 py-4 font-mono text-sm uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-300/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          {linkLabel}
          <ChevronRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
