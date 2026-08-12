import { STATES, getState } from "@/lib/states";
import type { Disease } from "@/lib/types";

type InfoDengueRow = {
  data_iniSE: string;
  SE: number;
  casos: number;
  casos_est: number;
  p_inc100k: number | null;
  nivel: number | null;
};

export type ArboWeek = {
  se: number;
  dataInicio: string;
  mes: number; // 1-12
  casos: number;
  casosEstimados: number;
  incidencia100k: number | null;
  nivel: 1 | 2 | 3 | 4 | null;
};

export type ArboDataset = {
  geocode: number;
  doenca: Disease;
  semanasAnoAtual: ArboWeek[];
  semanasAnoAnterior: ArboWeek[];
  /** Só preenchido quando uf === "BR": semanas do ano atual por capital estadual, para ranking. */
  porEstado?: { uf: string; cidade: string; semanas: ArboWeek[] }[];
};

async function fetchWeeks(
  geocode: number,
  disease: Disease,
  ano: number
): Promise<ArboWeek[]> {
  const url = new URL("https://info.dengue.mat.br/api/alertcity");
  url.searchParams.set("geocode", String(geocode));
  url.searchParams.set("disease", disease);
  url.searchParams.set("format", "json");
  url.searchParams.set("ew_start", "1");
  url.searchParams.set("ew_end", "53");
  url.searchParams.set("ey_start", String(ano));
  url.searchParams.set("ey_end", String(ano));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error("Falha ao consultar a fonte de dados epidemiológicos.");
  }

  const rows = (await res.json()) as InfoDengueRow[];

  return rows
    .map((row) => {
      const data = new Date(row.data_iniSE);
      return {
        se: row.SE,
        dataInicio: data.toISOString(),
        mes: data.getUTCMonth() + 1,
        casos: row.casos ?? 0,
        casosEstimados: Math.round(row.casos_est ?? 0),
        incidencia100k: row.p_inc100k ?? null,
        nivel: (row.nivel ?? null) as ArboWeek["nivel"],
      };
    })
    .sort((a, b) => a.se - b.se);
}

export async function getArbovirusDataset(
  geocode: number,
  disease: Disease,
  ano: number
): Promise<ArboDataset> {
  const [semanasAnoAtual, semanasAnoAnterior] = await Promise.all([
    fetchWeeks(geocode, disease, ano),
    fetchWeeks(geocode, disease, ano - 1),
  ]);

  return { geocode, doenca: disease, semanasAnoAtual, semanasAnoAnterior };
}

function mergeWeeks(weeksByCity: ArboWeek[][], populations: number[]): ArboWeek[] {
  const totalPop = populations.reduce((a, b) => a + b, 0) || 1;
  const bySE = new Map<number, { casos: number; casosEstimados: number; nivel: number; dataInicio: string; mes: number }>();

  weeksByCity.forEach((weeks) => {
    for (const w of weeks) {
      const entry = bySE.get(w.se) ?? {
        casos: 0,
        casosEstimados: 0,
        nivel: 0,
        dataInicio: w.dataInicio,
        mes: w.mes,
      };
      entry.casos += w.casos;
      entry.casosEstimados += w.casosEstimados;
      entry.nivel = Math.max(entry.nivel, w.nivel ?? 0);
      bySE.set(w.se, entry);
    }
  });

  return Array.from(bySE.entries())
    .map(([se, v]) => ({
      se,
      dataInicio: v.dataInicio,
      mes: v.mes,
      casos: v.casos,
      casosEstimados: v.casosEstimados,
      incidencia100k: (v.casosEstimados / totalPop) * 100000,
      nivel: (v.nivel || null) as ArboWeek["nivel"],
    }))
    .sort((a, b) => a.se - b.se);
}

/**
 * Para "todos os estados" (Brasil), soma os dados reais das 27 capitais —
 * não é uma agregação oficial nacional, mas é composta inteiramente por
 * dados reais do InfoDengue (não é simulado).
 */
export async function getArbovirusDatasetForUF(
  uf: string,
  disease: Disease,
  ano: number
): Promise<ArboDataset> {
  if (uf === "BR") {
    const populations = STATES.map((s) => s.capitalPopulation);
    const [currentByCity, previousByCity] = await Promise.all([
      Promise.allSettled(STATES.map((s) => fetchWeeks(s.capitalGeocode, disease, ano))),
      Promise.allSettled(STATES.map((s) => fetchWeeks(s.capitalGeocode, disease, ano - 1))),
    ]);

    const ok = <T,>(r: PromiseSettledResult<T>): r is PromiseFulfilledResult<T> =>
      r.status === "fulfilled";

    const porEstado = STATES.map((s, i) => {
      const result = currentByCity[i];
      return {
        uf: s.uf,
        cidade: s.capital,
        semanas: result.status === "fulfilled" ? result.value : [],
      };
    }).filter((e) => e.semanas.length > 0);

    return {
      geocode: 0,
      doenca: disease,
      semanasAnoAtual: mergeWeeks(currentByCity.filter(ok).map((r) => r.value), populations),
      semanasAnoAnterior: mergeWeeks(previousByCity.filter(ok).map((r) => r.value), populations),
      porEstado,
    };
  }

  const state = getState(uf);
  const geocode = state?.capitalGeocode ?? STATES[0].capitalGeocode;
  return getArbovirusDataset(geocode, disease, ano);
}

export function sumCasosEstimados(weeks: ArboWeek[], mes: "todos" | number): number {
  const filtered = mes === "todos" ? weeks : weeks.filter((w) => w.mes === mes);
  return filtered.reduce((sum, w) => sum + w.casosEstimados, 0);
}

export function sumCasosConfirmados(weeks: ArboWeek[], mes: "todos" | number): number {
  const filtered = mes === "todos" ? weeks : weeks.filter((w) => w.mes === mes);
  return filtered.reduce((sum, w) => sum + w.casos, 0);
}

export function monthlyTotals(weeks: ArboWeek[]): number[] {
  const totals = new Array(12).fill(0);
  for (const w of weeks) totals[w.mes - 1] += w.casosEstimados;
  return totals;
}

/** Último mês (1-12) com pelo menos uma semana de dados; 12 se o ano estiver completo. */
export function lastMonthWithData(weeks: ArboWeek[]): number {
  return weeks.reduce((max, w) => Math.max(max, w.mes), 0) || 12;
}

export function latestIncidence(weeks: ArboWeek[], mes: "todos" | number): number | null {
  const filtered = mes === "todos" ? weeks : weeks.filter((w) => w.mes === mes);
  const last = filtered.at(-1);
  return last?.incidencia100k ?? null;
}

export function latestAlertLevel(weeks: ArboWeek[], mes: "todos" | number): 1 | 2 | 3 | 4 | null {
  const filtered = mes === "todos" ? weeks : weeks.filter((w) => w.mes === mes);
  const last = filtered.at(-1);
  return last?.nivel ?? null;
}
