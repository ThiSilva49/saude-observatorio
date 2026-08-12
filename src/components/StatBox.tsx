export function StatBox({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-[var(--shadow-sm)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--series-1)]">
        {label}
      </p>
      <p className="text-[26px] font-extrabold leading-none text-[var(--text-primary)] sm:text-[32px]">
        {value}
      </p>
      {caption && <p className="text-xs text-[var(--text-muted)]">{caption}</p>}
    </div>
  );
}
