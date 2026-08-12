"use client";

import { Logo } from "@/components/Logo";

export function Nav({
  activeView,
  onNavigate,
}: {
  activeView: "panorama" | "explorar";
  onNavigate: (view: "panorama" | "explorar") => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--color-bg)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-bg)]/75">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-[15px] font-extrabold tracking-tight text-[var(--text-primary)]">
            SAÚDE OBSERVADA
          </span>
        </div>

        <nav className="ml-2 flex items-center gap-4 text-sm font-semibold">
          <button
            onClick={() => onNavigate("panorama")}
            className={
              activeView === "panorama"
                ? "text-[var(--series-1)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }
          >
            Panorama
          </button>
          <button
            onClick={() => onNavigate("explorar")}
            className={
              activeView === "explorar"
                ? "text-[var(--series-1)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }
          >
            Explorar dados
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-1.5 rounded-md bg-[var(--surface-blue)] px-2.5 py-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--series-1)] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--series-1)]" />
          </span>
          <span className="hidden text-xs font-medium text-[var(--text-secondary)] sm:inline">
            Dados ao vivo
          </span>
        </div>
      </div>
    </header>
  );
}
