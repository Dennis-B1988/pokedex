export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export interface PokemonDetails {
  weight: number;
  height: number;
  types: string[];
  abilities: string[];
}
