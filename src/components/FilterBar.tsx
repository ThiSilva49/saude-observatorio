"use client";

import { ChevronDown } from "lucide-react";
import { getState, MONTH_NAMES, STATES, YEAR_OPTIONS } from "@/lib/states";
import type { MesFiltro, MunicipioFiltro } from "@/lib/viewModel";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-[150px] flex-1 flex-col gap-1 text-sm sm:flex-none">
      <span className="text-xs font-semibold text-[var(--text-muted)]">{label}</span>
      <span className="relative flex items-center">
        {children}
        <ChevronDown
          size={15}
          strokeWidth={2}
          aria-hidden
          className="pointer-events-none absolute right-2.5 text-[var(--text-muted)]"
        />
      </span>
    </label>
  );
}

const selectClass =
  "min-h-10 w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-2 pl-3 pr-8 text-sm font-medium text-[var(--text-primary)] outline-none transition-colors hover:border-[var(--baseline)] focus:border-[var(--series-1)] focus:ring-2 focus:ring-[var(--series-1-fill)]";

export function FilterBar({
  uf,
  municipio,
  ano,
  mes,
  onChange,
}: {
  uf: string;
  municipio: MunicipioFiltro;
  ano: number;
  mes: MesFiltro;
  onChange: (next: { uf?: string; municipio?: MunicipioFiltro; ano?: number; mes?: MesFiltro }) => void;
}) {
  const state = getState(uf);

  return (
    <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-blue)] p-3 sm:p-4">
      <Field label="Estado">
        <select
          className={selectClass}
          value={uf}
          onChange={(e) => onChange({ uf: e.target.value, municipio: "todos" })}
        >
          <option value="BR">Brasil (todos os estados)</option>
          {STATES.map((s) => (
            <option key={s.uf} value={s.uf}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Município">
        <select
          className={selectClass}
          value={municipio}
          disabled={uf === "BR"}
          onChange={(e) => onChange({ municipio: e.target.value as MunicipioFiltro })}
        >
          {uf === "BR" ? (
            <option value="todos">Todos os municípios</option>
          ) : (
            <>
              <option value="todos">Todo o estado</option>
              <option value="capital">{state?.capital} (capital)</option>
            </>
          )}
        </select>
      </Field>

      <Field label="Ano">
        <select
          className={selectClass}
          value={ano}
          onChange={(e) => onChange({ ano: Number(e.target.value) })}
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mês">
        <select
          className={selectClass}
          value={mes}
          onChange={(e) =>
            onChange({ mes: e.target.value === "todos" ? "todos" : Number(e.target.value) })
          }
        >
          <option value="todos">Ano todo</option>
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m.slice(0, 3)}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}
