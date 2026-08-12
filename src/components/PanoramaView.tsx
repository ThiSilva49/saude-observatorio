import { DiseaseCard } from "@/components/DiseaseCard";
import type { CardViewModel } from "@/lib/viewModel";

export function PanoramaView({
  cards,
  periodoLabel,
  locationLabel,
  onSelectDisease,
}: {
  cards: CardViewModel[];
  periodoLabel: string;
  locationLabel: string;
  onSelectDisease: (id: CardViewModel["id"]) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2>Panorama — {periodoLabel}</h2>
        <span className="text-[13px] text-[var(--text-muted)]">{locationLabel}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <DiseaseCard key={card.id} card={card} onSelect={() => onSelectDisease(card.id)} />
        ))}
      </div>
    </section>
  );
}
