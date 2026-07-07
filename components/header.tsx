type HeaderProps = {
  agentName?: string;
  missionName: string;
};

export function Header(props: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between font-mono text-sm uppercase tracking-[0.18em] text-cyan-200/80">
      <span className="uppercase">&gt;_ {props.missionName}</span>

      <span className="flex items-center gap-2 text-xs">
        <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] animate-pulse" />
        Online
      </span>
    </header>
  );
}
