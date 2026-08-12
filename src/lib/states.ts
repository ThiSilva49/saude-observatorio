export type StateInfo = {
  uf: string;
  name: string;
  population: number;
  capital: string;
  capitalPopulation: number;
  /** Código IBGE de 7 dígitos da capital, usado nas consultas ao InfoDengue. */
  capitalGeocode: number;
};

// Estimativas populacionais aproximadas, usadas para escalar indicadores
// ilustrativos. Não são números oficiais.
export const STATES: StateInfo[] = [
  { uf: "AC", name: "Acre", population: 830000, capital: "Rio Branco", capitalPopulation: 420000, capitalGeocode: 1200401 },
  { uf: "AL", name: "Alagoas", population: 3130000, capital: "Maceió", capitalPopulation: 1020000, capitalGeocode: 2704302 },
  { uf: "AP", name: "Amapá", population: 780000, capital: "Macapá", capitalPopulation: 512000, capitalGeocode: 1600303 },
  { uf: "AM", name: "Amazonas", population: 4200000, capital: "Manaus", capitalPopulation: 2220000, capitalGeocode: 1302603 },
  { uf: "BA", name: "Bahia", population: 14850000, capital: "Salvador", capitalPopulation: 2900000, capitalGeocode: 2927408 },
  { uf: "CE", name: "Ceará", population: 9240000, capital: "Fortaleza", capitalPopulation: 2700000, capitalGeocode: 2304400 },
  { uf: "DF", name: "Distrito Federal", population: 2820000, capital: "Brasília", capitalPopulation: 2820000, capitalGeocode: 5300108 },
  { uf: "ES", name: "Espírito Santo", population: 4100000, capital: "Vitória", capitalPopulation: 370000, capitalGeocode: 3205309 },
  { uf: "GO", name: "Goiás", population: 7210000, capital: "Goiânia", capitalPopulation: 1560000, capitalGeocode: 5208707 },
  { uf: "MA", name: "Maranhão", population: 6870000, capital: "São Luís", capitalPopulation: 1115000, capitalGeocode: 2111300 },
  { uf: "MT", name: "Mato Grosso", population: 3660000, capital: "Cuiabá", capitalPopulation: 620000, capitalGeocode: 5103403 },
  { uf: "MS", name: "Mato Grosso do Sul", population: 2840000, capital: "Campo Grande", capitalPopulation: 920000, capitalGeocode: 5002704 },
  { uf: "MG", name: "Minas Gerais", population: 20730000, capital: "Belo Horizonte", capitalPopulation: 2530000, capitalGeocode: 3106200 },
  { uf: "PA", name: "Pará", population: 8760000, capital: "Belém", capitalPopulation: 1500000, capitalGeocode: 1501402 },
  { uf: "PB", name: "Paraíba", population: 4050000, capital: "João Pessoa", capitalPopulation: 825000, capitalGeocode: 2507507 },
  { uf: "PR", name: "Paraná", population: 11600000, capital: "Curitiba", capitalPopulation: 1980000, capitalGeocode: 4106902 },
  { uf: "PE", name: "Pernambuco", population: 9670000, capital: "Recife", capitalPopulation: 1660000, capitalGeocode: 2611606 },
  { uf: "PI", name: "Piauí", population: 3290000, capital: "Teresina", capitalPopulation: 870000, capitalGeocode: 2211001 },
  { uf: "RJ", name: "Rio de Janeiro", population: 16690000, capital: "Rio de Janeiro", capitalPopulation: 6775000, capitalGeocode: 3304557 },
  { uf: "RN", name: "Rio Grande do Norte", population: 3320000, capital: "Natal", capitalPopulation: 900000, capitalGeocode: 2408102 },
  { uf: "RS", name: "Rio Grande do Sul", population: 10990000, capital: "Porto Alegre", capitalPopulation: 1490000, capitalGeocode: 4314902 },
  { uf: "RO", name: "Rondônia", population: 1580000, capital: "Porto Velho", capitalPopulation: 540000, capitalGeocode: 1100205 },
  { uf: "RR", name: "Roraima", population: 640000, capital: "Boa Vista", capitalPopulation: 420000, capitalGeocode: 1400100 },
  { uf: "SC", name: "Santa Catarina", population: 7760000, capital: "Florianópolis", capitalPopulation: 520000, capitalGeocode: 4205407 },
  { uf: "SP", name: "São Paulo", population: 44410000, capital: "São Paulo", capitalPopulation: 12330000, capitalGeocode: 3550308 },
  { uf: "SE", name: "Sergipe", population: 2210000, capital: "Aracaju", capitalPopulation: 660000, capitalGeocode: 2800308 },
  { uf: "TO", name: "Tocantins", population: 1580000, capital: "Palmas", capitalPopulation: 310000, capitalGeocode: 1721000 },
];

export const TOTAL_POPULATION = STATES.reduce((sum, s) => sum + s.population, 0);

export function getState(uf: string): StateInfo | undefined {
  return STATES.find((s) => s.uf === uf);
}

export function getPopulation(uf: string, municipio: "todos" | "capital"): number {
  if (uf === "BR") return TOTAL_POPULATION;
  const state = getState(uf);
  if (!state) return TOTAL_POPULATION;
  return municipio === "capital" ? state.capitalPopulation : state.population;
}

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export const YEAR_OPTIONS = [2022, 2023, 2024, 2025, 2026];
