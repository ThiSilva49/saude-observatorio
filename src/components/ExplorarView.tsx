import { Download } from "lucide-react";
import { AlertBadge } from "@/components/AlertBadge";
import { MonthlyAreaChart } from "@/components/MonthlyAreaChart";
import { RankingEstados } from "@/components/RankingEstados";
import { StatBox } from "@/components/StatBox";
import { Tag } from "@/components/Tag";
import { DISEASES, DISEASE_IDS } from "@/lib/diseases";
import { MONTH_NAMES } from "@/lib/states";
import type { CardViewModel } from "@/lib/viewModel";

function downloadCard(card: CardViewModel) {
  const rows = [
    ["mes", "valor"],
    ...card.monthlySeriesValues.map((v, i) => [MONTH_NAMES[i] ?? String(i + 1), String(v)]),
  ];
  const csv = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${card.id}-serie-mensal.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExplorarView({
  cards,
  activeId,
  onSelectDisease,
  locationLabel,
  periodoLabel,
}: {
  cards: CardViewModel[];
  activeId: CardViewModel["id"];
  onSelectDisease: (id: CardViewModel["id"]) => void;
  locationLabel: string;
  periodoLabel: string;
}) {
  const card = cards.find((c) => c.id === activeId) ?? cards[0];

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {DISEASE_IDS.map((id) => {
          const active = id === activeId;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectDisease(id)}
              className={
                active
                  ? "rounded-lg bg-[var(--series-1)] px-3.5 py-2 text-sm font-bold text-white"
                  : "rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-blue)]"
              }
            >
              {DISEASES[id].label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2">
          {card.label}
          <Tag variant="neutral">{card.category}</Tag>
          {!card.real && <Tag variant="outline">Ilustrativo</Tag>}
        </h2>
        <span className="text-[13px] text-[var(--text-muted)]">
          {locationLabel} · {periodoLabel}
        </span>
      </div>
      <p className="-mt-3 max-w-[70ch] text-sm text-[var(--text-secondary)]">{card.description}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          label={card.primaryLabel}
          value={card.primaryDisplay}
          caption={`${card.deltaDisplay} vs. ano anterior`}
        />
        <StatBox label={card.secondary1Label} value={card.secondary1Display} />
        <StatBox label={card.secondary2Label} value={card.secondary2Display} />
        {card.hasAlert && (
          <div className="flex flex-col justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-[var(--shadow-sm)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--series-1)]">
              Nível de alerta
            </p>
            <AlertBadge level={card.alertLevel} label={card.alertLabel} size="lg" />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--series-1)]">
            Série mensal — {card.label} ({periodoLabel})
          </p>
          <button
            type="button"
            onClick={() => downloadCard(card)}
            className="flex items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-blue)]"
          >
            <Download size={12} strokeWidth={2.5} aria-hidden />
            Exportar CSV
          </button>
        </div>
        <div className="mt-2">
          <MonthlyAreaChart
            linePoints={card.chartLinePoints}
            areaPoints={card.chartAreaPoints}
            monthCount={card.monthCount}
          />
        </div>
      </div>

      {card.ranking && <RankingEstados entries={card.ranking} diseaseLabel={card.label} />}

      <p className="text-xs text-[var(--text-muted)]">{card.sourceNote}</p>
    </section>
  );
}
