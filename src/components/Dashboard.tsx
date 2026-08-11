"use client";

import { useEffect, useState } from "react";
import { ArbovirusSection } from "@/components/ArbovirusSection";
import { CitySelector } from "@/components/CitySelector";
import { CovidSection } from "@/components/CovidSection";
import { DiseaseSelector } from "@/components/DiseaseSelector";
import { DEFAULT_CITY_GEOCODE } from "@/lib/cities";
import type { ArboviroseResponse, CovidResponse, Disease } from "@/lib/types";

export function Dashboard({
  initialCovid,
  initialArbovirus,
}: {
  initialCovid: CovidResponse | null;
  initialArbovirus: ArboviroseResponse | null;
}) {
  const [geocode, setGeocode] = useState(DEFAULT_CITY_GEOCODE);
  const [disease, setDisease] = useState<Disease>("dengue");
  const [arbovirus, setArbovirus] = useState(initialArbovirus);
  const [loadingArbovirus, setLoadingArbovirus] = useState(false);
  const [arbovirusError, setArbovirusError] = useState(false);

  useEffect(() => {
    if (geocode === DEFAULT_CITY_GEOCODE && disease === "dengue") {
      setArbovirus(initialArbovirus);
      return;
    }

    const controller = new AbortController();
    setLoadingArbovirus(true);
    setArbovirusError(false);

    fetch(`/api/arbovirus?geocode=${geocode}&disease=${disease}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((json: ArboviroseResponse) => setArbovirus(json))
      .catch((err) => {
        if (err.name !== "AbortError") setArbovirusError(true);
      })
      .finally(() => setLoadingArbovirus(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geocode, disease]);

  return (
    <div className="flex flex-col gap-10">
      {initialCovid ? (
        <CovidSection data={initialCovid} />
      ) : (
        <p className="text-sm text-[var(--text-muted)]">
          Não foi possível carregar os dados de COVID-19 no momento.
        </p>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <CitySelector value={geocode} onChange={setGeocode} />
          <DiseaseSelector value={disease} onChange={setDisease} />
        </div>

        {arbovirusError && (
          <p className="text-sm text-[var(--status-critical)]">
            Não foi possível carregar os dados para esta seleção. Tente
            novamente em instantes.
          </p>
        )}

        <div
          aria-busy={loadingArbovirus}
          className={loadingArbovirus ? "opacity-60 transition-opacity" : "transition-opacity"}
        >
          {arbovirus && <ArbovirusSection data={arbovirus} />}
        </div>
      </section>
    </div>
  );
}
