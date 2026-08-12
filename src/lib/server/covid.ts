const CURRENT_URL = "https://disease.sh/v3/covid-19/countries/brazil";
const HISTORICAL_URL = "https://disease.sh/v3/covid-19/historical/brazil?lastdays=all";

type DiseaseShCountry = {
  updated: number;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
};

type DiseaseShHistorical = {
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
  };
};

export type MonthlyBucket = {
  casosNovos: number;
  mortesNovas: number;
};

export type CovidDataset = {
  atualizadoEm: string;
  casosAtivos: number;
  casosTotais: number;
  mortesTotais: number;
  recuperados: number;
  /** meses[ano][mes 1-12] = novos casos/mortes naquele mês */
  meses: Record<number, Record<number, MonthlyBucket>>;
};

export async function getCovidDataset(): Promise<CovidDataset> {
  const [currentRes, historicalRes] = await Promise.all([
    fetch(CURRENT_URL, { next: { revalidate: 1800 } }),
    fetch(HISTORICAL_URL, { next: { revalidate: 1800 } }),
  ]);

  if (!currentRes.ok || !historicalRes.ok) {
    throw new Error("Falha ao consultar a fonte de dados de COVID-19.");
  }

  const current = (await currentRes.json()) as DiseaseShCountry;
  const historical = (await historicalRes.json()) as DiseaseShHistorical;

  const entries = Object.entries(historical.timeline.cases)
    .map(([date, cases]) => ({
      date: new Date(date),
      cases,
      deaths: historical.timeline.deaths[date] ?? 0,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const meses: Record<number, Record<number, MonthlyBucket>> = {};

  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1];
    const curr = entries[i];
    const novosCasos = Math.max(0, curr.cases - prev.cases);
    const novasMortes = Math.max(0, curr.deaths - prev.deaths);
    const ano = curr.date.getUTCFullYear();
    const mes = curr.date.getUTCMonth() + 1;
    meses[ano] ??= {};
    meses[ano][mes] ??= { casosNovos: 0, mortesNovas: 0 };
    meses[ano][mes].casosNovos += novosCasos;
    meses[ano][mes].mortesNovas += novasMortes;
  }

  return {
    atualizadoEm: new Date(current.updated).toISOString(),
    casosAtivos: current.active,
    casosTotais: current.cases,
    mortesTotais: current.deaths,
    recuperados: current.recovered,
    meses,
  };
}

/** Último mês (1-12) com registros na fonte para o ano; 0 se não houver nenhum. */
export function lastMonthWithData(meses: Record<number, MonthlyBucket> | undefined): number {
  if (!meses) return 0;
  const months = Object.keys(meses).map(Number);
  return months.length ? Math.max(...months) : 0;
}

export function sumYear(meses: Record<number, MonthlyBucket> | undefined): MonthlyBucket {
  if (!meses) return { casosNovos: 0, mortesNovas: 0 };
  return Object.values(meses).reduce(
    (acc, m) => ({
      casosNovos: acc.casosNovos + m.casosNovos,
      mortesNovas: acc.mortesNovas + m.mortesNovas,
    }),
    { casosNovos: 0, mortesNovas: 0 }
  );
}
