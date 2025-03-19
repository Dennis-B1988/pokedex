import { inject, Injectable, signal } from "@angular/core";
import { Pokemon } from "../../models/pokemon-details.model";
import { PokemonService } from "../pokemon/pokemon.service";

@Injectable({
  providedIn: "root",
})
export class PokemonSearchService {
  private pokemonService = inject(PokemonService);

  pokemonList = signal<Pokemon[]>([]);
  searchTerm = signal<string>("");

  searchPokemon(search: string) {
    this.searchTerm.set(search);

    if (search.length <= 2) {
      this.pokemonList.set([]); // Reset when search is too short
      return;
    }

    const filtered = this.pokemonService
      .pokemons()
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase()),
      );

    this.pokemonList.set(filtered);
    console.log(this.pokemonList());
  }
}
