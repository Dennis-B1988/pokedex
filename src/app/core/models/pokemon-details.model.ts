export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: string[];
  abilities: string[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export interface PokemonDetails {}

export interface PokemonEvolution {}

export interface RegionData {
  start: number;
  end: number;
  title: string;
}

export type RegionKey =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar";
