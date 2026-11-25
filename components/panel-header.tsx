import type { ReactNode } from "react";
import Link from "next/link";

type PanelHeaderIcon =
  | {
      iconHref: string;
      iconLabel: string;
    }
  | {
      iconHref?: never;
      iconLabel?: never;
    };

type PanelHeaderProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  icon: ReactNode;
} & PanelHeaderIcon;

const iconClassName =
  "flex size-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/5 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.18)]";

export function PanelHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  iconHref,
  iconLabel,
}: PanelHeaderProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/70">
          {eyebrow}
        </p>
        <h1 className="neon-text mt-3 font-mono text-3xl font-semibold uppercase tracking-[0.14em]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-cyan-100/70">
            {subtitle}
          </p>
        ) : null}
      </div>

      {iconHref ? (
        <Link
          href={iconHref}
          aria-label={iconLabel}
          title={iconLabel}
          className={`${iconClassName} transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70`}
        >
          {icon}
        </Link>
      ) : (
        <div className={iconClassName} aria-hidden="true">
          {icon}
        </div>
      )}
    </header>
  );
}
