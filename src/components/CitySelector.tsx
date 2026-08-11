"use client";

import { CITIES } from "@/lib/cities";

export function CitySelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (geocode: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--text-secondary)]">Cidade</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--series-1)]"
      >
        {CITIES.map((city) => (
          <option key={city.geocode} value={city.geocode}>
            {city.name} - {city.state}
          </option>
        ))}
      </select>
    </label>
  );
}
