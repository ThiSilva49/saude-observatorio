import { StatCard } from "@/components/StatCard";
import { TrendChart, type TrendPoint } from "@/components/TrendChart";
import { formatCompact, formatDate, formatShortDate } from "@/lib/format";
import type { CovidResponse } from "@/lib/types";

export function CovidSection({ data }: { data: CovidResponse }) {
  const casosSeries: TrendPoint[] = data.historico.map((d) => ({
    label: formatShortDate(d.data),
    tooltipLabel: formatDate(d.data),
    value: d.casos,
  }));

  const mortesSeries: TrendPoint[] = data.historico.map((d) => ({
    label: formatShortDate(d.data),
    tooltipLabel: formatDate(d.data),
    value: d.mortes,
  }));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          COVID-19 no Brasil
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Dados nacionais acumulados. Atualizado em {formatDate(data.atualizadoEm)}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Casos totais" value={formatCompact(data.casosTotais)} />
        <StatCard label="Mortes totais" value={formatCompact(data.mortesTotais)} />
        <StatCard label="Casos ativos" value={formatCompact(data.casosAtivos)} />
        <StatCard
          label="Recuperados"
          value={formatCompact(data.recuperados)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TrendChart
          title="Casos acumulados (últimos 180 dias)"
          data={casosSeries}
          color="var(--series-1)"
          valueLabel="Casos"
        />
        <TrendChart
          title="Mortes acumuladas (últimos 180 dias)"
          data={mortesSeries}
          color="var(--series-2)"
          valueLabel="Mortes"
        />
      </div>
    </section>
  );
}
