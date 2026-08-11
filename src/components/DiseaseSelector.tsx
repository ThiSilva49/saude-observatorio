"use client";

import { DISEASE_LABELS, type Disease } from "@/lib/types";

const OPTIONS = Object.keys(DISEASE_LABELS) as Disease[];

export function DiseaseSelector({
  value,
  onChange,
}: {
  value: Disease;
  onChange: (disease: Disease) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--text-secondary)]">Doença</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Disease)}
        className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--series-1)]"
      >
        {OPTIONS.map((disease) => (
          <option key={disease} value={disease}>
            {DISEASE_LABELS[disease]}
          </option>
        ))}
      </select>
    </label>
  );
}
