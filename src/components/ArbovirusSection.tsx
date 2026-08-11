import { AlertBadge } from "@/components/AlertBadge";
import { StatCard } from "@/components/StatCard";
import { TrendChart, type TrendPoint } from "@/components/TrendChart";
import { formatCompact, formatDate, formatShortDate } from "@/lib/format";
import { DISEASE_LABELS, type ArboviroseResponse } from "@/lib/types";

export function ArbovirusSection({ data }: { data: ArboviroseResponse }) {
  const semanasDoAno = data.semanas.filter((s) =>
    String(s.se).startsWith(String(data.ano))
  );

  const casosEstimadosNoAno = semanasDoAno.reduce(
    (sum, s) => sum + s.casosEstimados,
    0
  );
  const casosConfirmadosNoAno = semanasDoAno.reduce(
    (sum, s) => sum + s.casos,
    0
  );

  const ultimaSemana = data.semanas.at(-1) ?? null;

  const serie: TrendPoint[] = data.semanas.map((s) => ({
    label: formatShortDate(s.dataInicio),
    tooltipLabel: `Semana ${String(s.se).slice(4)}/${String(s.se).slice(0, 4)} · ${formatDate(s.dataInicio)}`,
    value: s.casosEstimados,
  }));

  const diseaseLabel = DISEASE_LABELS[data.doenca];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {diseaseLabel} {data.cidade ? `em ${data.cidade}` : ""}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Fonte: InfoDengue (Fiocruz). Semanas epidemiológicas de{" "}
          {data.ano - 1} e {data.ano}.
        </p>
      </div>

      {data.semanas.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center text-sm text-[var(--text-muted)]">
          Sem dados disponíveis para esta cidade e doença no período.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label={`Casos estimados em ${data.ano}`}
              value={formatCompact(casosEstimadosNoAno)}
            />
            <StatCard
              label={`Casos confirmados em ${data.ano}`}
              value={formatCompact(casosConfirmadosNoAno)}
            />
            <StatCard
              label="Incidência (últ. semana, /100mil hab.)"
              value={
                ultimaSemana?.incidencia100k != null
                  ? ultimaSemana.incidencia100k.toFixed(1)
                  : "—"
              }
            />
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-5">
              <p className="text-sm text-[var(--text-secondary)]">
                Nível de alerta atual
              </p>
              <div className="mt-2">
                <AlertBadge nivel={ultimaSemana?.nivel ?? null} />
              </div>
            </div>
          </div>

          <TrendChart
            title={`Casos estimados por semana epidemiológica`}
            data={serie}
            color="var(--series-1)"
            valueLabel="Casos estimados"
          />
        </>
      )}
    </section>
  );
}
