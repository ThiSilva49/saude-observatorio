import { ALERT_LEVEL_LABELS, DISEASE_IDS, DISEASES, type DiseaseId } from "@/lib/diseases";
import {
  buildPoints,
  computeSecondary,
  formatCompact,
  formatDelta,
  formatPercent,
  formatRate,
  mockAlertLevel,
  monthlySeries,
  selectValue,
} from "@/lib/mock";
import type { ArboDataset } from "@/lib/server/arbovirus";
import {
  lastMonthWithData as lastArboMonth,
  latestAlertLevel,
  latestIncidence,
  monthlyTotals,
  sumCasosConfirmados,
  sumCasosEstimados,
} from "@/lib/server/arbovirus";
import type { CovidDataset } from "@/lib/server/covid";
import { lastMonthWithData as lastCovidMonth, sumYear } from "@/lib/server/covid";
import { getPopulation, getState, MONTH_NAMES } from "@/lib/states";

export type MesFiltro = "todos" | number;
export type MunicipioFiltro = "todos" | "capital";

export type CardViewModel = {
  id: DiseaseId;
  label: string;
  category: string;
  real: boolean;
  primaryLabel: string;
  primaryDisplay: string;
  deltaPct: number;
  deltaDisplay: string;
  deltaWorse: boolean;
  secondary1Label: string;
  secondary1Display: string;
  secondary2Label: string;
  secondary2Display: string;
  hasAlert: boolean;
  alertLevel: 1 | 2 | 3 | 4 | null;
  alertLabel: string | null;
  description: string;
  sparklinePoints: string;
  chartLinePoints: string;
  chartAreaPoints: string;
  monthCount: number;
  monthlySeriesValues: number[];
  sourceNote: string;
  ranking: RankingEntry[] | null;
};

export type RankingEntry = {
  uf: string;
  cidade: string;
  incidencia100k: number | null;
  casosEstimados: number;
  nivel: 1 | 2 | 3 | 4 | null;
};

function formatSecondary(unit: "casos" | "percent" | "rate100k", value: number): string {
  if (unit === "percent") return formatPercent(value);
  if (unit === "rate100k") return formatRate(value);
  return formatCompact(value);
}

const MOCK_SOURCE_NOTE =
  "Dados ilustrativos — integração planejada com DATASUS/SINAN e Ministério da Saúde. Não representa números oficiais.";

export function buildMockCard(
  diseaseId: DiseaseId,
  uf: string,
  municipio: MunicipioFiltro,
  ano: number,
  mes: MesFiltro
): CardViewModel {
  const disease = DISEASES[diseaseId];
  const series = monthlySeries(disease, uf, municipio, ano);
  const prevSeries = monthlySeries(disease, uf, municipio, ano - 1);
  const annualTotal = selectValue(series, disease.unit, "todos");
  const prevAnnualTotal = selectValue(prevSeries, disease.unit, "todos");
  const deltaPct = prevAnnualTotal ? ((annualTotal - prevAnnualTotal) / prevAnnualTotal) * 100 : 0;
  const displayValue = selectValue(series, disease.unit, mes);
  const pop = getPopulation(uf, municipio);

  const ctx = { diseaseId, uf, municipio, ano, primaryAnnual: annualTotal, pop };
  const sec1 = computeSecondary(disease.secondary1, ctx);
  const sec2 = computeSecondary(disease.secondary2, ctx);

  let alertLevel: 1 | 2 | 3 | 4 | null = null;
  if (disease.hasAlert) alertLevel = mockAlertLevel(diseaseId, uf, municipio, ano, mes);

  return {
    id: diseaseId,
    label: disease.label,
    category: disease.category,
    real: false,
    primaryLabel: disease.unit === "prevalencia" ? "Prevalência estimada" : "Casos no período",
    primaryDisplay: disease.unit === "casos" ? formatCompact(displayValue) : formatPercent(displayValue),
    deltaPct,
    deltaDisplay: formatDelta(deltaPct),
    deltaWorse: deltaPct >= 0,
    secondary1Label: disease.secondary1.label,
    secondary1Display: formatSecondary(disease.secondary1.unit, sec1),
    secondary2Label: disease.secondary2.label,
    secondary2Display: formatSecondary(disease.secondary2.unit, sec2),
    hasAlert: disease.hasAlert,
    alertLevel,
    alertLabel: alertLevel ? ALERT_LEVEL_LABELS[alertLevel] : null,
    description: disease.description,
    sparklinePoints: buildPoints(series, 72, 24, 4, 2),
    chartLinePoints: buildPoints(series, 600, 190, 10, 10),
    chartAreaPoints: buildPoints(series, 600, 190, 10, 10) + " 600,190 0,190",
    monthCount: 12,
    monthlySeriesValues: series,
    sourceNote: MOCK_SOURCE_NOTE,
    ranking: null,
  };
}

export function buildCovidCard(
  dataset: CovidDataset,
  uf: string,
  ano: number,
  mes: MesFiltro
): CardViewModel {
  const disease = DISEASES.covid19;
  const mesesAno = dataset.meses[ano] ?? {};
  const mesesAnoAnterior = dataset.meses[ano - 1] ?? {};
  const totalAno = sumYear(mesesAno);
  const totalAnoAnterior = sumYear(mesesAnoAnterior);
  const bucket = mes === "todos" ? totalAno : mesesAno[mes] ?? { casosNovos: 0, mortesNovas: 0 };
  const semRegistroNoAno = lastCovidMonth(mesesAno) === 0;
  const deltaPct = totalAnoAnterior.casosNovos
    ? ((totalAno.casosNovos - totalAnoAnterior.casosNovos) / totalAnoAnterior.casosNovos) * 100
    : 0;
  const monthCount = semRegistroNoAno ? 12 : lastCovidMonth(mesesAno);
  const series = Array.from({ length: monthCount }, (_, i) => mesesAno[i + 1]?.casosNovos ?? 0);

  return {
    id: "covid19",
    label: disease.label,
    category: disease.category,
    real: true,
    primaryLabel: "Casos no período",
    primaryDisplay: formatCompact(bucket.casosNovos),
    deltaPct,
    deltaDisplay:
      totalAno.casosNovos === 0 && totalAnoAnterior.casosNovos === 0 ? "sem registro" : formatDelta(deltaPct),
    deltaWorse: deltaPct >= 0,
    secondary1Label: "Casos ativos (atual)",
    secondary1Display: formatCompact(dataset.casosAtivos),
    secondary2Label: mes === "todos" ? "Óbitos no ano" : "Óbitos no mês",
    secondary2Display: formatCompact(bucket.mortesNovas),
    hasAlert: false,
    alertLevel: null,
    alertLabel: null,
    description:
      disease.description +
      (uf !== "BR" ? " Dado nacional — a fonte não segmenta por estado." : "") +
      (semRegistroNoAno
        ? " A fonte não tem novos registros diários para este ano (reporte de rotina foi descontinuado)."
        : ""),
    sparklinePoints: buildPoints(series, 72, 24, 4, 2),
    chartLinePoints: buildPoints(series, 600, 190, 10, 10),
    chartAreaPoints: buildPoints(series, 600, 190, 10, 10) + " 600,190 0,190",
    monthCount,
    monthlySeriesValues: series,
    sourceNote: `Fonte: disease.sh — dados nacionais de COVID-19, atualizados em ${new Date(dataset.atualizadoEm).toLocaleDateString("pt-BR")}.`,
    ranking: null,
  };
}

export function buildArboCard(
  dataset: ArboDataset,
  diseaseId: "dengue" | "zika" | "chikungunya",
  uf: string,
  mes: MesFiltro
): CardViewModel {
  const disease = DISEASES[diseaseId];
  const casosEstAno = sumCasosEstimados(dataset.semanasAnoAtual, "todos");
  const casosEstAnoAnterior = sumCasosEstimados(dataset.semanasAnoAnterior, "todos");
  const deltaPct = casosEstAnoAnterior
    ? ((casosEstAno - casosEstAnoAnterior) / casosEstAnoAnterior) * 100
    : 0;
  const displayValue = sumCasosEstimados(dataset.semanasAnoAtual, mes);
  const casosConfirmados = sumCasosConfirmados(dataset.semanasAnoAtual, mes);
  const incidencia = latestIncidence(dataset.semanasAnoAtual, mes);
  const nivel = latestAlertLevel(dataset.semanasAnoAtual, mes);
  const monthCount = lastArboMonth(dataset.semanasAnoAtual);
  const series = monthlyTotals(dataset.semanasAnoAtual).slice(0, monthCount);
  const locNote =
    uf === "BR"
      ? " Agregado a partir de dados reais das 27 capitais estaduais."
      : " Dado real da capital, usado como referência do estado.";

  const ranking: RankingEntry[] | null = dataset.porEstado
    ? dataset.porEstado
        .map((e) => ({
          uf: e.uf,
          cidade: e.cidade,
          incidencia100k: latestIncidence(e.semanas, mes),
          casosEstimados: sumCasosEstimados(e.semanas, mes),
          nivel: latestAlertLevel(e.semanas, mes),
        }))
        .sort((a, b) => (b.incidencia100k ?? -1) - (a.incidencia100k ?? -1))
    : null;

  return {
    id: diseaseId,
    label: disease.label,
    category: disease.category,
    real: true,
    primaryLabel: "Casos estimados",
    primaryDisplay: formatCompact(displayValue),
    deltaPct,
    deltaDisplay: formatDelta(deltaPct),
    deltaWorse: deltaPct >= 0,
    secondary1Label: disease.secondary1.label,
    secondary1Display: incidencia != null ? formatRate(incidencia) : "—",
    secondary2Label: disease.secondary2.label,
    secondary2Display: formatCompact(casosConfirmados),
    hasAlert: true,
    alertLevel: nivel,
    alertLabel: nivel ? ALERT_LEVEL_LABELS[nivel] : null,
    description: disease.description + locNote,
    sparklinePoints: buildPoints(series, 72, 24, 4, 2),
    chartLinePoints: buildPoints(series, 600, 190, 10, 10),
    chartAreaPoints: buildPoints(series, 600, 190, 10, 10) + " 600,190 0,190",
    monthCount,
    monthlySeriesValues: series,
    sourceNote: "Fonte: InfoDengue (Fiocruz/UFMG) — dados reais por semana epidemiológica.",
    ranking,
  };
}

export { DISEASE_IDS };

export function locationLabel(uf: string, municipio: MunicipioFiltro): string {
  if (uf === "BR") return "Brasil — todos os estados";
  const s = getState(uf);
  if (!s) return uf;
  return municipio === "capital" ? `${s.capital} (${uf})` : `${s.name} (${uf})`;
}

export function periodoLabel(ano: number, mes: MesFiltro): string {
  return mes === "todos" ? `Ano de ${ano}` : `${MONTH_NAMES[Number(mes) - 1]} de ${ano}`;
}
