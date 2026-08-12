import type { RankingEntry } from "@/lib/viewModel";

const LEVEL_COLOR: Record<number, string> = {
  1: "var(--status-good)",
  2: "var(--status-warning)",
  3: "var(--status-serious)",
  4: "var(--status-critical)",
};

export function RankingEstados({ entries, diseaseLabel }: { entries: RankingEntry[]; diseaseLabel: string }) {
  const ranked = entries.filter((e) => e.incidencia100k != null);
  if (ranked.length === 0) return null;
  const max = Math.max(...ranked.map((e) => e.incidencia100k ?? 0)) || 1;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--series-1)]">
        Ranking por capital — incidência de {diseaseLabel} (/100 mil hab.)
      </p>
      <ol className="mt-3 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
        {ranked.map((e, i) => (
          <li key={e.uf} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-right text-xs font-bold text-[var(--text-muted)]">
              {i + 1}
            </span>
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: e.nivel ? LEVEL_COLOR[e.nivel] : "var(--text-muted)" }}
            />
            <span className="w-32 shrink-0 truncate text-xs font-semibold text-[var(--text-secondary)] sm:w-40">
              {e.cidade} ({e.uf})
            </span>
            <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-blue)]">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--series-1)]"
                style={{ width: `${((e.incidencia100k ?? 0) / max) * 100}%` }}
              />
            </span>
            <span className="w-16 shrink-0 text-right text-xs font-bold text-[var(--text-primary)]">
              {(e.incidencia100k ?? 0).toFixed(1).replace(".", ",")}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-[11px] text-[var(--text-muted)]">
        Capitais estaduais, ordenadas pela incidência mais recente do período selecionado.
      </p>
    </div>
  );
}
