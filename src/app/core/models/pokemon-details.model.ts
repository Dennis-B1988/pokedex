export interface Pokemon {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: Array<{ type: { name: string } }>;
  // abilities: string[];
  // stats: Array<{ base_stat: number; stat: { name: string } }>;
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

export const pokemonTypeColors = {
  normal: "A8A878",
  fire: "F08030",
  water: "6890F0",
  electric: "F8D030",
  grass: "78C850",
  ice: "98D8D8",
  fighting: "C03028",
  poison: "A040A0",
  ground: "E0C068",
  flying: "A890F0",
  psychic: "F85888",
  bug: "A8B820",
  rock: "B8A038",
  ghost: "705898",
  dragon: "7038F8",
  dark: "705848",
  steel: "B8B8D0",
  fairy: "EE99AC",
};
