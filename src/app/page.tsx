import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { DEFAULT_CITY_GEOCODE } from "@/lib/cities";
import { getArbovirusData } from "@/lib/server/arbovirus";
import { getCovidData } from "@/lib/server/covid";
import type { ArboviroseResponse, CovidResponse } from "@/lib/types";

export const revalidate = 1800;

export default async function Home() {
  const [covidResult, arbovirusResult] = await Promise.allSettled([
    getCovidData(),
    getArbovirusData(DEFAULT_CITY_GEOCODE, "dengue"),
  ]);

  const initialCovid: CovidResponse | null =
    covidResult.status === "fulfilled" ? covidResult.value : null;
  const initialArbovirus: ArboviroseResponse | null =
    arbovirusResult.status === "fulfilled" ? arbovirusResult.value : null;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-2 px-4 py-6 sm:px-6 sm:py-10">
      <header className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
          Observatório de Saúde
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          COVID-19, dengue, zika e chikungunya a partir de fontes públicas.
        </p>
      </header>

      <Dashboard initialCovid={initialCovid} initialArbovirus={initialArbovirus} />

      <Footer />
    </main>
  );
}
