import { TOTAL_POPULATION, getPopulation } from "@/lib/states";
import type { DiseaseDef, SecondaryDef } from "@/lib/diseases";

/**
 * Gerador determinístico (seeded) de dados ilustrativos, usado apenas para
 * os indicadores que ainda não têm fonte pública conectada. Os mesmos
 * filtros sempre produzem os mesmos números — não é aleatório de verdade,
 * é hash determinístico do filtro selecionado.
 */

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function rand(parts: (string | number)[]): number {
  let seed = hashStr(parts.join("|"));
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function seasonalWeights(kind: DiseaseDef["seasonal"]): number[] {
  if (kind === "rainy") return [1.6, 1.7, 1.6, 1.3, 0.9, 0.6, 0.5, 0.5, 0.6, 0.8, 1.1, 1.4];
  if (kind === "winter") return [0.7, 0.6, 0.7, 0.9, 1.3, 1.6, 1.7, 1.5, 1.1, 0.8, 0.7, 0.7];
  return [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
}

export function monthlySeries(
  disease: DiseaseDef,
  uf: string,
  municipio: "todos" | "capital",
  ano: number
): number[] {
  const pop = getPopulation(uf, municipio);
  const scale = pop / TOTAL_POPULATION;
  const weights = seasonalWeights(disease.seasonal);
  const wsum = weights.reduce((a, b) => a + b, 0);

  if (disease.unit === "casos") {
    const yearFactor = 0.85 + rand([disease.id, uf, municipio, ano, "year"]) * 0.3;
    const annual = disease.baseline * scale * yearFactor;
    return weights.map((w, i) =>
      Math.max(
        0,
        annual * (w / wsum) * (0.9 + rand([disease.id, uf, municipio, ano, "noise", i]) * 0.2)
      )
    );
  }

  const regionDrift = (rand([disease.id, uf, "region"]) - 0.5) * 4;
  const yearDrift = (rand([disease.id, uf, municipio, ano, "year"]) - 0.5) * 2;
  const base = Math.max(1, disease.baseline + regionDrift + yearDrift);
  return weights.map(
    (_, i) => Math.max(0, base + (rand([disease.id, uf, municipio, ano, "noise", i]) - 0.5) * 0.6)
  );
}

export function selectValue(series: number[], unit: DiseaseDef["unit"], mes: "todos" | number): number {
  if (mes === "todos") {
    const sum = series.reduce((a, b) => a + b, 0);
    return unit === "casos" ? sum : sum / series.length;
  }
  return series[mes - 1];
}

type SecondaryCtx = {
  diseaseId: string;
  uf: string;
  municipio: "todos" | "capital";
  ano: number;
  primaryAnnual: number;
  pop: number;
};

export function computeSecondary(def: SecondaryDef, ctx: SecondaryCtx): number {
  if (def.unit === "percent") {
    const drift = (rand([ctx.diseaseId, ctx.uf, ctx.municipio, ctx.ano, "sec", def.label]) - 0.5) * 6;
    return Math.min(97, Math.max(3, (def.baseline ?? 50) + drift));
  }
  if (def.unit === "rate100k") {
    if (def.baseline != null) {
      const drift = (rand([ctx.diseaseId, ctx.uf, ctx.municipio, ctx.ano, "sec", def.label]) - 0.5) * 20;
      return Math.max(0, def.baseline + drift);
    }
    return (ctx.primaryAnnual / ctx.pop) * 100000;
  }
  const scale = ctx.pop / TOTAL_POPULATION;
  const yearFactor = 0.85 + rand([ctx.diseaseId, ctx.uf, ctx.municipio, ctx.ano, "sec", def.label]) * 0.3;
  return (def.baseline ?? 0) * scale * yearFactor;
}

export function mockAlertLevel(
  diseaseId: string,
  uf: string,
  municipio: "todos" | "capital",
  ano: number,
  mes: "todos" | number
): 1 | 2 | 3 | 4 {
  const r = rand([diseaseId, uf, municipio, ano, mes, "alert"]);
  return r < 0.5 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4;
}

export function buildPoints(series: number[], w: number, h: number, padTop: number, padBottom: number): string {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const n = series.length;
  return series
    .map((v, i) => {
      const x = n > 1 ? i * (w / (n - 1)) : 0;
      const y = h - padBottom - ((v - min) / range) * (h - padTop - padBottom);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatPercent(n: number): string {
  return n.toFixed(1).replace(".", ",") + "%";
}

export function formatRate(n: number): string {
  return n.toFixed(1).replace(".", ",") + "/100mil";
}

export function formatDelta(pct: number): string {
  return (pct >= 0 ? "▲ " : "▼ ") + Math.abs(pct).toFixed(1).replace(".", ",") + "%";
}
