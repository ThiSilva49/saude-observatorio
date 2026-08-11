import { ALERT_LEVEL_LABELS } from "@/lib/types";

const LEVEL_COLOR: Record<number, string> = {
  1: "var(--status-good)",
  2: "var(--status-warning)",
  3: "var(--status-serious)",
  4: "var(--status-critical)",
};

export function AlertBadge({ nivel }: { nivel: number | null }) {
  const label = nivel ? ALERT_LEVEL_LABELS[nivel] : "Sem classificação";
  const color = nivel ? LEVEL_COLOR[nivel] : "var(--text-muted)";

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5">
      <span
        aria-hidden
        className="h-2.5 w-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </span>
    </span>
  );
}
