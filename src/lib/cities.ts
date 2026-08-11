export type City = {
  geocode: number;
  name: string;
  state: string;
};

// Capitais brasileiras com o código IBGE de 7 dígitos usado pela API InfoDengue.
export const CITIES: City[] = [
  { geocode: 2611606, name: "Recife", state: "PE" },
  { geocode: 3550308, name: "São Paulo", state: "SP" },
  { geocode: 3304557, name: "Rio de Janeiro", state: "RJ" },
  { geocode: 3106200, name: "Belo Horizonte", state: "MG" },
  { geocode: 2927408, name: "Salvador", state: "BA" },
  { geocode: 2304400, name: "Fortaleza", state: "CE" },
  { geocode: 5300108, name: "Brasília", state: "DF" },
  { geocode: 4106902, name: "Curitiba", state: "PR" },
  { geocode: 4314902, name: "Porto Alegre", state: "RS" },
  { geocode: 1302603, name: "Manaus", state: "AM" },
  { geocode: 1501402, name: "Belém", state: "PA" },
  { geocode: 5208707, name: "Goiânia", state: "GO" },
  { geocode: 2408102, name: "Natal", state: "RN" },
  { geocode: 2507507, name: "João Pessoa", state: "PB" },
  { geocode: 2704302, name: "Maceió", state: "AL" },
  { geocode: 3205309, name: "Vitória", state: "ES" },
  { geocode: 4205407, name: "Florianópolis", state: "SC" },
  { geocode: 2800308, name: "Aracaju", state: "SE" },
];

export const DEFAULT_CITY_GEOCODE = 2611606; // Recife

export function findCity(geocode: number): City | undefined {
  return CITIES.find((c) => c.geocode === geocode);
}
