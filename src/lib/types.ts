export type Disease = "dengue" | "zika" | "chikungunya";

export const DISEASE_LABELS: Record<Disease, string> = {
  dengue: "Dengue",
  zika: "Zika",
  chikungunya: "Chikungunya",
};

export type ArboviroseWeek = {
  se: number; // semana epidemiológica, formato AAAASS
  dataInicio: string; // ISO date
  casos: number;
  casosEstimados: number;
  incidencia100k: number | null;
  nivel: 1 | 2 | 3 | 4 | null; // 1 verde, 2 amarelo, 3 laranja, 4 vermelho
  populacao: number | null;
};

export type ArboviroseResponse = {
  geocode: number;
  cidade: string;
  doenca: Disease;
  ano: number;
  semanas: ArboviroseWeek[];
};

export type CovidHistoricoDia = {
  data: string; // ISO date
  casos: number;
  mortes: number;
};

export type CovidResponse = {
  atualizadoEm: string;
  casosTotais: number;
  mortesTotais: number;
  recuperados: number;
  casosAtivos: number;
  casosNovos: number;
  mortesNovas: number;
  historico: CovidHistoricoDia[];
};

export const ALERT_LEVEL_LABELS: Record<number, string> = {
  1: "Baixo",
  2: "Atenção",
  3: "Alerta",
  4: "Alto risco",
};
