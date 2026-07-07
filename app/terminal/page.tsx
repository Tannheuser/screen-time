import { ChevronRight, Home, LockKeyhole, ShieldCheck } from "lucide-react";

export default async function Terminal() {
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-48px)] w-full max-w-md flex-col rounded-[2rem]">
      <div className="glass-panel rounded-[1.5rem] p-5">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-300/70">
              Active Mission
            </p>

            <h1 className="neon-text mt-3 font-mono text-3xl font-semibold uppercase tracking-[0.14em]">
              Blue Key
            </h1>

            <p className="mt-3 font-mono text-sm uppercase tracking-[0.16em] text-cyan-100/70">
              Status: in progress
            </p>
          </div>

          <div className="flex size-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/5 shadow-[0_0_24px_rgba(34,211,238,0.18)]">
            <LockKeyhole className="size-7 text-cyan-200" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
            <span>Mission Progress</span>
            <span>2 / 4</span>
          </div>

          <div className="h-3 rounded-full border border-cyan-200/20 bg-black/30 p-0.5">
            <div className="h-full w-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
          </div>

          <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-cyan-300/70">
            Access Code
          </p>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {["7", "4", "–", "–"].map((digit, index) => (
              <div
                key={index}
                className="neon-border flex aspect-square items-center justify-center rounded-xl border bg-black/20 font-mono text-4xl text-cyan-200"
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {[
            ["01", "Math Sequence", "Completed"],
            ["02", "Pattern Lock", "Completed"],
            ["03", "Logic Gate", "Locked"],
          ].map(([num, title, status]) => (
            <div
              key={num}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 font-mono"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl text-cyan-300">{num}</span>
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-cyan-100">
                    {title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-200/50">
                    {status}
                  </p>
                </div>
              </div>

              <ShieldCheck className="size-5 text-cyan-300/70" />
            </div>
          ))}
        </div>

        <button className="neon-border mt-6 flex w-full items-center justify-between rounded-xl border bg-cyan-300/5 px-5 py-4 font-mono text-sm uppercase tracking-[0.22em] text-cyan-200">
          <span>&gt; Continue Mission</span>
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/*<nav className="glass-panel mt-auto grid grid-cols-3 rounded-[1.5rem] px-4 py-3">
        <NavItem active icon={<Home className="size-6" />} label="Terminal" />
        <NavItem icon={<LockKeyhole className="size-6" />} label="Missions" />
        <NavItem icon={<ShieldCheck className="size-6" />} label="Stats" />
      </nav>*/}
    </section>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "flex flex-col items-center gap-1 rounded-xl py-2 font-mono text-[10px] uppercase tracking-[0.16em]",
        active ? "neon-text" : "text-cyan-100/45",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
