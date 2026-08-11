export function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
        {value}
      </p>
      {caption && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{caption}</p>
      )}
    </div>
  );
}
