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

  pokemons = signal<Pokemon[]>([]);
  start = signal<number>(0);
  limit: number = 50;

  isLoading = signal<boolean>(true);

  constructor() {
    const subscripe = this.fetchPokemons(0, 151).subscribe({
      next: (pokemons) => {
        this.pokemons.set(pokemons);
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
        console.log(this.pokemons());
        console.log(this.start());
      },
    });

    this.destroyRef.onDestroy(() => {
      subscripe.unsubscribe();
    });
  }

  fetchPokemons(start: number, limit: number): Observable<Pokemon[]> {
    return this.http
      .get<{
        results: { name: string; url: string }[];
      }>(`${this.pokeAPI}?offset=${start}&limit=${limit}`)
      .pipe(
        switchMap((response) => {
          const pokemonRequests = response.results.map((pokemon) =>
            this.http.get<Pokemon>(pokemon.url),
          );
          this.start.set(this.start() + this.limit);
          return forkJoin(pokemonRequests);
        }),
      );
  }

  loadMorePokemons(start: number, limit: number): void {
    this.isLoading.set(true);
    this.fetchPokemons(limit, start).subscribe({
      next: (newPokemons) => {
        this.pokemons.update((pokemons) => [...pokemons, ...newPokemons]);
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
