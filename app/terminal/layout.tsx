import { Header } from "@/components/header";

export default function TerminalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <main className="min-h-dvh bg-slate-950 text-slate-200">
    //   <div className="min-h-dvh bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.18),transparent_35%),linear-gradient(180deg,#020617,#020617)] px-4 py-6">
    <>
      <Header missionName="mission terminal" />
      {children}
    </>
    //   </div>
    // </main>
  );
}
