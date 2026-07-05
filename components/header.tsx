import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="px-5 py-4">
      <div className="flex items-center justify-between">
        <button>
          <Menu className="size-6 text-emerald-400" />
        </button>

        <div className="text-center">
          <h1 className="font-mono text-xl tracking-[0.18em] text-emerald-300">
            UNLOCK EXTRA TIME
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
