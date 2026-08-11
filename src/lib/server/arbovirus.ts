import { findCity } from "@/lib/cities";
import type { ArboviroseResponse, ArboviroseWeek, Disease } from "@/lib/types";

type InfoDengueRow = {
  data_iniSE: string;
  SE: number;
  casos: number;
  casos_est: number;
  p_inc100k: number | null;
  nivel: number | null;
  pop: number | null;
};

export async function getArbovirusData(
  geocode: number,
  disease: Disease
): Promise<ArboviroseResponse> {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const startYear = currentYear - 1;

  const url = new URL("https://info.dengue.mat.br/api/alertcity");
  url.searchParams.set("geocode", String(geocode));
  url.searchParams.set("disease", disease);
  url.searchParams.set("format", "json");
  url.searchParams.set("ew_start", "1");
  url.searchParams.set("ew_end", "53");
  url.searchParams.set("ey_start", String(startYear));
  url.searchParams.set("ey_end", String(currentYear));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error("Falha ao consultar a fonte de dados epidemiológicos.");
  }

  const rows = (await res.json()) as InfoDengueRow[];

  const semanas: ArboviroseWeek[] = rows
    .map((row) => ({
      se: row.SE,
      dataInicio: new Date(row.data_iniSE).toISOString(),
      casos: row.casos ?? 0,
      casosEstimados: Math.round(row.casos_est ?? 0),
      incidencia100k: row.p_inc100k ?? null,
      nivel: (row.nivel ?? null) as ArboviroseWeek["nivel"],
      populacao: row.pop ?? null,
    }))
    .sort((a, b) => a.se - b.se);

  const city = findCity(geocode);

  return {
    geocode,
    cidade: city?.name ?? "",
    doenca: disease,
    ano: currentYear,
    semanas,
  };
}
