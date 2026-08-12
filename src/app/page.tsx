import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { Tag } from "@/components/Tag";
import { DISEASE_IDS } from "@/lib/diseases";
import { getArbovirusDatasetForUF } from "@/lib/server/arbovirus";
import { getCovidDataset } from "@/lib/server/covid";
import { YEAR_OPTIONS } from "@/lib/states";
import {
  buildArboCard,
  buildCovidCard,
  buildMockCard,
  locationLabel,
  periodoLabel,
} from "@/lib/viewModel";

export const revalidate = 1800;

const DEFAULT_UF = "BR";
const DEFAULT_MUNICIPIO = "todos" as const;
const DEFAULT_ANO = YEAR_OPTIONS[YEAR_OPTIONS.length - 1];
const DEFAULT_MES = "todos" as const;

export default async function Home() {
  const [covidResult, dengueResult, zikaResult, chikungunyaResult] = await Promise.allSettled([
    getCovidDataset(),
    getArbovirusDatasetForUF(DEFAULT_UF, "dengue", DEFAULT_ANO),
    getArbovirusDatasetForUF(DEFAULT_UF, "zika", DEFAULT_ANO),
    getArbovirusDatasetForUF(DEFAULT_UF, "chikungunya", DEFAULT_ANO),
  ]);

  const arboResults = { dengue: dengueResult, zika: zikaResult, chikungunya: chikungunyaResult };

  const cards = DISEASE_IDS.map((id) => {
    if (id === "covid19") {
      return covidResult.status === "fulfilled"
        ? buildCovidCard(covidResult.value, DEFAULT_UF, DEFAULT_ANO, DEFAULT_MES)
        : buildMockCard(id, DEFAULT_UF, DEFAULT_MUNICIPIO, DEFAULT_ANO, DEFAULT_MES);
    }
    if (id === "dengue" || id === "zika" || id === "chikungunya") {
      const result = arboResults[id];
      return result.status === "fulfilled"
        ? buildArboCard(result.value, id, DEFAULT_UF, DEFAULT_MES)
        : buildMockCard(id, DEFAULT_UF, DEFAULT_MUNICIPIO, DEFAULT_ANO, DEFAULT_MES);
    }
    return buildMockCard(id, DEFAULT_UF, DEFAULT_MUNICIPIO, DEFAULT_ANO, DEFAULT_MES);
  });

  const initialData = {
    uf: DEFAULT_UF,
    municipio: DEFAULT_MUNICIPIO,
    ano: DEFAULT_ANO,
    mes: DEFAULT_MES,
    locationLabel: locationLabel(DEFAULT_UF, DEFAULT_MUNICIPIO),
    periodoLabel: periodoLabel(DEFAULT_ANO, DEFAULT_MES),
    cards,
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--series-1)]">
          Painel público de saúde
        </p>
        <h1 className="mt-2 max-w-2xl text-4xl sm:text-[56px]">SAÚDE OBSERVADA</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Indicadores de dengue, COVID-19, tuberculose, HIV/Aids, sífilis, diabetes,
          hipertensão, obesidade, saúde mental e câncer no Brasil, com filtros por
          estado, município, ano e mês.
        </p>
        <p className="mt-2 max-w-2xl text-xs text-[var(--text-muted)]">
          Dengue e COVID-19 usam dados públicos reais (InfoDengue/Fiocruz e
          disease.sh). Os demais 8 indicadores são ilustrativos até a integração
          com DATASUS/SINAN — cada um traz um aviso claro.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag variant="accent">Dados reais: Dengue, COVID-19</Tag>
          <Tag variant="neutral">Ilustrativos: os demais 8</Tag>
        </div>
      </div>

      <div className="mt-8">
        <Dashboard initialData={initialData} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Footer />
      </div>
    </main>
  );
}
