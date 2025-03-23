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

  /**
   * Updates the `pokemonList` signal with an array of Pokemon filtered by
   * the given search string. The search is case-insensitive and will
   * match either the name of the Pokemon or its ID. If the search string
   * is empty, the `pokemonList` will be set to an empty array.
   *
   * @param search The search string to filter by.
   */
  searchPokemon(search: string) {
    this.searchTerm.set(search);

    if (search.length === 0) {
      this.pokemonList.set([]);
      return;
    }

    const filtered = this.pokemonService
      .pokemons()
      .filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
          pokemon.id.toString().includes(search),
      );

    this.pokemonList.set(filtered);
  }
}
