import { HttpClient } from "@angular/common/http";
import { DestroyRef, inject, Injectable, signal } from "@angular/core";
import { forkJoin, Observable, switchMap } from "rxjs";
import { environment } from "../../../../environment/environment";
import { Pokemon, PokemonDetails } from "../../models/pokemon-details.model";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private pokeAPI = environment.pokemonURL;
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private pokemonCache: Record<string, Pokemon[]> = {};
  pokemons = signal<Pokemon[]>([]);
  isLoading = signal<boolean>(true);

  fetchPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.pokeAPI}/${id}`);
  }

  loadPokemons(start: number, end: number): void {
    const cacheKey = `${start}-${end}`;

    if (this.pokemonCache[cacheKey]) {
      this.pokemons.set(this.pokemonCache[cacheKey]);
      return;
    }

    this.isLoading.set(true);

    const pokemonRequests = Array.from({ length: end - start + 1 }, (_, i) =>
      this.fetchPokemon(start + i + 1),
    );

    const subscription = forkJoin(pokemonRequests).subscribe({
      next: (pokemonData) => {
        this.pokemonCache[cacheKey] = pokemonData;
        this.pokemons.set(pokemonData);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
