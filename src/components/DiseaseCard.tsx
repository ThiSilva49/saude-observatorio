import { AlertBadge } from "@/components/AlertBadge";
import { Sparkline } from "@/components/Sparkline";
import { Tag } from "@/components/Tag";
import type { CardViewModel } from "@/lib/viewModel";

export function DiseaseCard({
  card,
  onSelect,
}: {
  card: CardViewModel;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--series-1)]">
          {card.category}
        </p>
        {!card.real && <Tag variant="neutral">Ilustrativo</Tag>}
      </div>
      <h3 className="text-[17px] font-extrabold leading-tight text-[var(--text-primary)]">
        {card.label}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-[28px] font-extrabold leading-none text-[var(--text-primary)]">
          {card.primaryDisplay}
        </span>
        <Tag variant={card.deltaWorse ? "blue" : "accent"}>{card.deltaDisplay}</Tag>
      </div>
      <Sparkline points={card.sparklinePoints} />
      <p className="flex-1 text-[13px] text-[var(--text-secondary)]">{card.description}</p>
      {card.hasAlert && (
        <div className="border-t border-[var(--border)] pt-2">
          <span className="text-[11px] text-[var(--text-muted)]">Nível de alerta: </span>
          <AlertBadge level={card.alertLevel} label={card.alertLabel} />
        </div>
      )}
    </button>
  );
}
