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
