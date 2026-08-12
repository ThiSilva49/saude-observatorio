import { NextResponse } from "next/server";
import { DISEASE_IDS } from "@/lib/diseases";
import { getArbovirusDatasetForUF } from "@/lib/server/arbovirus";
import { getCovidDataset } from "@/lib/server/covid";
import {
  buildArboCard,
  buildCovidCard,
  buildMockCard,
  locationLabel,
  periodoLabel,
  type MesFiltro,
  type MunicipioFiltro,
} from "@/lib/viewModel";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const uf = searchParams.get("uf") ?? "BR";
  const municipio = (searchParams.get("municipio") ?? "todos") as MunicipioFiltro;
  const ano = Number(searchParams.get("ano") ?? 2026);
  const mesParam = searchParams.get("mes") ?? "todos";
  const mes: MesFiltro = mesParam === "todos" ? "todos" : Number(mesParam);

  const [covidResult, dengueResult, zikaResult, chikungunyaResult] = await Promise.allSettled([
    getCovidDataset(),
    getArbovirusDatasetForUF(uf, "dengue", ano),
    getArbovirusDatasetForUF(uf, "zika", ano),
    getArbovirusDatasetForUF(uf, "chikungunya", ano),
  ]);

  const arboResults = { dengue: dengueResult, zika: zikaResult, chikungunya: chikungunyaResult };

  const cards = DISEASE_IDS.map((id) => {
    if (id === "covid19") {
      return covidResult.status === "fulfilled"
        ? buildCovidCard(covidResult.value, uf, ano, mes)
        : buildMockCard(id, uf, municipio, ano, mes);
    }
    if (id === "dengue" || id === "zika" || id === "chikungunya") {
      const result = arboResults[id];
      return result.status === "fulfilled"
        ? buildArboCard(result.value, id, uf, mes)
        : buildMockCard(id, uf, municipio, ano, mes);
    }
    return buildMockCard(id, uf, municipio, ano, mes);
  });

  return NextResponse.json({
    uf,
    municipio,
    ano,
    mes,
    locationLabel: locationLabel(uf, municipio),
    periodoLabel: periodoLabel(ano, mes),
    cards,
  });
}
