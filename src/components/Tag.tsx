export function Tag({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "accent" | "neutral" | "outline" | "blue";
}) {
  const styles: Record<string, string> = {
    accent: "bg-[var(--series-1-fill)] text-[var(--series-1)]",
    blue: "bg-[var(--series-2-fill)] text-[var(--series-2)]",
    neutral: "bg-[var(--surface-blue)] text-[var(--text-secondary)]",
    outline: "border border-[var(--series-1)] text-[var(--series-1)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
