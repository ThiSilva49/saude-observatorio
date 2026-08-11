import type { CovidHistoricoDia, CovidResponse } from "@/lib/types";

const CURRENT_URL = "https://disease.sh/v3/covid-19/countries/brazil";
const HISTORICAL_URL =
  "https://disease.sh/v3/covid-19/historical/brazil?lastdays=180";

type DiseaseShCountry = {
  updated: number;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  todayCases: number;
  todayDeaths: number;
};

type DiseaseShHistorical = {
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
  };
};

export async function getCovidData(): Promise<CovidResponse> {
  const [currentRes, historicalRes] = await Promise.all([
    fetch(CURRENT_URL, { next: { revalidate: 1800 } }),
    fetch(HISTORICAL_URL, { next: { revalidate: 1800 } }),
  ]);

  if (!currentRes.ok || !historicalRes.ok) {
    throw new Error("Falha ao consultar a fonte de dados de COVID-19.");
  }

  const current = (await currentRes.json()) as DiseaseShCountry;
  const historical = (await historicalRes.json()) as DiseaseShHistorical;

  const historico: CovidHistoricoDia[] = Object.entries(
    historical.timeline.cases
  ).map(([date, cases]) => ({
    data: new Date(date).toISOString(),
    casos: cases,
    mortes: historical.timeline.deaths[date] ?? 0,
  }));

  historico.sort((a, b) => a.data.localeCompare(b.data));

  return {
    atualizadoEm: new Date(current.updated).toISOString(),
    casosTotais: current.cases,
    mortesTotais: current.deaths,
    recuperados: current.recovered,
    casosAtivos: current.active,
    casosNovos: current.todayCases,
    mortesNovas: current.todayDeaths,
    historico,
  };
}
