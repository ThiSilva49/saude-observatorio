const LEVEL_COLOR: Record<number, string> = {
  1: "var(--status-good)",
  2: "var(--status-warning)",
  3: "var(--status-serious)",
  4: "var(--status-critical)",
};

export function AlertBadge({
  level,
  label,
  size = "sm",
}: {
  level: 1 | 2 | 3 | 4 | null;
  label: string | null;
  size?: "sm" | "lg";
}) {
  const color = level ? LEVEL_COLOR[level] : "var(--text-muted)";
  const swatch = size === "lg" ? 14 : 8;

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        style={{ width: swatch, height: swatch, backgroundColor: color, display: "inline-block", flex: "none" }}
      />
      <span
        className={
          size === "lg"
            ? "text-lg font-extrabold text-[var(--text-primary)]"
            : "text-xs text-[var(--text-secondary)]"
        }
      >
        {label ?? "Sem classificação"}
      </span>
    </span>
  );
}
