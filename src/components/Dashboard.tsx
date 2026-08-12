"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ExplorarView } from "@/components/ExplorarView";
import { FilterBar } from "@/components/FilterBar";
import { Nav } from "@/components/Nav";
import { PanoramaView } from "@/components/PanoramaView";
import type { DiseaseId } from "@/lib/diseases";
import type { CardViewModel, MesFiltro, MunicipioFiltro } from "@/lib/viewModel";

type HealthDataResponse = {
  uf: string;
  municipio: MunicipioFiltro;
  ano: number;
  mes: MesFiltro;
  locationLabel: string;
  periodoLabel: string;
  cards: CardViewModel[];
};

export function Dashboard({ initialData }: { initialData: HealthDataResponse }) {
  const [activeView, setActiveView] = useState<"panorama" | "explorar">("panorama");
  const [activeDisease, setActiveDisease] = useState<DiseaseId>("dengue");
  const [uf, setUf] = useState(initialData.uf);
  const [municipio, setMunicipio] = useState<MunicipioFiltro>(initialData.municipio);
  const [ano, setAno] = useState(initialData.ano);
  const [mes, setMes] = useState<MesFiltro>(initialData.mes);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (
      uf === initialData.uf &&
      municipio === initialData.municipio &&
      ano === initialData.ano &&
      mes === initialData.mes
    ) {
      setData(initialData);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(false);

    const params = new URLSearchParams({
      uf,
      municipio,
      ano: String(ano),
      mes: String(mes),
    });

    fetch(`/api/health-data?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((json: HealthDataResponse) => setData(json))
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uf, municipio, ano, mes]);

  function handleFilterChange(next: {
    uf?: string;
    municipio?: MunicipioFiltro;
    ano?: number;
    mes?: MesFiltro;
  }) {
    if (next.uf !== undefined) setUf(next.uf);
    if (next.municipio !== undefined) setMunicipio(next.municipio);
    if (next.ano !== undefined) setAno(next.ano);
    if (next.mes !== undefined) setMes(next.mes);
  }

  return (
    <div className="flex flex-col gap-5">
      <Nav activeView={activeView} onNavigate={setActiveView} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-16 sm:px-6">
        <FilterBar uf={uf} municipio={municipio} ano={ano} mes={mes} onChange={handleFilterChange} />

        {error && (
          <p className="text-sm font-semibold text-[var(--status-critical)]">
            Não foi possível atualizar os dados para esta seleção. Tente novamente.
          </p>
        )}

        {loading && (
          <span className="flex items-center gap-1.5 self-start text-xs text-[var(--text-muted)]">
            <Loader2 size={14} className="animate-spin" aria-hidden />
            Atualizando…
          </span>
        )}

        <div
          aria-busy={loading}
          className={loading ? "opacity-60 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"}
        >
          {activeView === "panorama" ? (
            <PanoramaView
              cards={data.cards}
              periodoLabel={data.periodoLabel}
              locationLabel={data.locationLabel}
              onSelectDisease={(id) => {
                setActiveDisease(id);
                setActiveView("explorar");
              }}
            />
          ) : (
            <ExplorarView
              cards={data.cards}
              activeId={activeDisease}
              onSelectDisease={setActiveDisease}
              locationLabel={data.locationLabel}
              periodoLabel={data.periodoLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
