export type DiseaseId =
  | "dengue"
  | "zika"
  | "chikungunya"
  | "covid19"
  | "tuberculose"
  | "hiv"
  | "sifilis"
  | "diabetes"
  | "hipertensao"
  | "obesidade"
  | "saude_mental"
  | "cancer";

export type SecondaryUnit = "casos" | "percent" | "rate100k";

export type SecondaryDef = {
  label: string;
  unit: SecondaryUnit;
  baseline?: number;
};

export type DiseaseDef = {
  id: DiseaseId;
  label: string;
  category: "Transmissível" | "Doença crônica" | "Comportamental";
  unit: "casos" | "prevalencia";
  hasAlert: boolean;
  seasonal: "rainy" | "winter" | "flat";
  baseline: number;
  description: string;
  secondary1: SecondaryDef;
  secondary2: SecondaryDef;
  /** true = alimentado por API pública real; false = dado ilustrativo/simulado */
  real: boolean;
  source: string;
};

export const DISEASES: Record<DiseaseId, DiseaseDef> = {
  dengue: {
    id: "dengue",
    label: "Dengue",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "rainy",
    baseline: 3200000,
    description:
      "Casos estimados de dengue, com sazonalidade concentrada no primeiro semestre do ano.",
    secondary1: { label: "Incidência (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Casos confirmados", unit: "casos", baseline: 1900000 },
    real: true,
    source: "InfoDengue (Fiocruz)",
  },
  zika: {
    id: "zika",
    label: "Zika",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "rainy",
    baseline: 30000,
    description:
      "Casos prováveis de zika vírus, com sazonalidade concentrada no primeiro semestre do ano.",
    secondary1: { label: "Incidência (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Casos confirmados", unit: "casos", baseline: 12000 },
    real: true,
    source: "InfoDengue (Fiocruz)",
  },
  chikungunya: {
    id: "chikungunya",
    label: "Chikungunya",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "rainy",
    baseline: 220000,
    description:
      "Casos prováveis de chikungunya, com sazonalidade concentrada no primeiro semestre do ano.",
    secondary1: { label: "Incidência (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Casos confirmados", unit: "casos", baseline: 130000 },
    real: true,
    source: "InfoDengue (Fiocruz)",
  },
  covid19: {
    id: "covid19",
    label: "COVID-19",
    category: "Transmissível",
    unit: "casos",
    hasAlert: false,
    seasonal: "winter",
    baseline: 900000,
    description: "Casos notificados de síndrome respiratória associada à COVID-19.",
    secondary1: { label: "Casos ativos (estimados)", unit: "casos", baseline: 18000 },
    secondary2: { label: "Óbitos no período", unit: "casos", baseline: 5400 },
    real: true,
    source: "disease.sh",
  },
  tuberculose: {
    id: "tuberculose",
    label: "Tuberculose",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "flat",
    baseline: 82000,
    description: "Novos casos de tuberculose notificados ao sistema de vigilância.",
    secondary1: { label: "Incidência (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Coeficiente de cura", unit: "percent", baseline: 72 },
    real: false,
    source: "Dados ilustrativos",
  },
  hiv: {
    id: "hiv",
    label: "HIV/Aids",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "flat",
    baseline: 38000,
    description: "Novos casos de HIV/Aids notificados no período selecionado.",
    secondary1: { label: "Taxa de detecção (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Em tratamento antirretroviral", unit: "percent", baseline: 78 },
    real: false,
    source: "Dados ilustrativos",
  },
  sifilis: {
    id: "sifilis",
    label: "Sífilis",
    category: "Transmissível",
    unit: "casos",
    hasAlert: true,
    seasonal: "flat",
    baseline: 158000,
    description: "Casos notificados de sífilis adquirida, gestacional e congênita.",
    secondary1: { label: "Incidência (/100 mil hab.)", unit: "rate100k" },
    secondary2: { label: "Gestantes notificadas", unit: "casos", baseline: 44000 },
    real: false,
    source: "Dados ilustrativos",
  },
  diabetes: {
    id: "diabetes",
    label: "Diabetes",
    category: "Doença crônica",
    unit: "prevalencia",
    hasAlert: false,
    seasonal: "flat",
    baseline: 9.1,
    description: "Prevalência estimada de diabetes autorreferida na população adulta.",
    secondary1: { label: "Internações por complicações", unit: "casos", baseline: 96000 },
    secondary2: { label: "Cobertura na atenção básica", unit: "percent", baseline: 68 },
    real: false,
    source: "Dados ilustrativos",
  },
  hipertensao: {
    id: "hipertensao",
    label: "Hipertensão",
    category: "Doença crônica",
    unit: "prevalencia",
    hasAlert: false,
    seasonal: "flat",
    baseline: 24.5,
    description:
      "Prevalência estimada de hipertensão arterial autorreferida na população adulta.",
    secondary1: { label: "Internações", unit: "casos", baseline: 61000 },
    secondary2: { label: "Cobertura na atenção básica", unit: "percent", baseline: 70 },
    real: false,
    source: "Dados ilustrativos",
  },
  obesidade: {
    id: "obesidade",
    label: "Obesidade",
    category: "Doença crônica",
    unit: "prevalencia",
    hasAlert: false,
    seasonal: "flat",
    baseline: 22.0,
    description:
      "Prevalência estimada de obesidade na população adulta, por IMC autorreferido.",
    secondary1: { label: "Prevalência infantil", unit: "percent", baseline: 12 },
    secondary2: { label: "Sedentarismo associado", unit: "percent", baseline: 46 },
    real: false,
    source: "Dados ilustrativos",
  },
  saude_mental: {
    id: "saude_mental",
    label: "Saúde mental",
    category: "Comportamental",
    unit: "casos",
    hasAlert: false,
    seasonal: "flat",
    baseline: 1150000,
    description:
      "Atendimentos de saúde mental registrados na rede de atenção psicossocial.",
    secondary1: { label: "Internações psiquiátricas", unit: "casos", baseline: 44000 },
    secondary2: { label: "Notificações de autolesão", unit: "casos", baseline: 29000 },
    real: false,
    source: "Dados ilustrativos",
  },
  cancer: {
    id: "cancer",
    label: "Câncer",
    category: "Doença crônica",
    unit: "casos",
    hasAlert: false,
    seasonal: "flat",
    baseline: 704000,
    description:
      "Casos novos estimados de câncer, de todos os tipos, por estimativas periódicas.",
    secondary1: { label: "Taxa de mortalidade (/100 mil hab.)", unit: "rate100k", baseline: 190 },
    secondary2: { label: "Em rastreamento ativo", unit: "casos", baseline: 210000 },
    real: false,
    source: "Dados ilustrativos",
  },
};

export const DISEASE_IDS = Object.keys(DISEASES) as DiseaseId[];

export const ALERT_LEVEL_LABELS: Record<number, string> = {
  1: "Baixo",
  2: "Atenção",
  3: "Alerta",
  4: "Alto risco",
};
