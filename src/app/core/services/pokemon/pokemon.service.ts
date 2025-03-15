import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { forkJoin, switchMap } from "rxjs";
import { environment } from "../../../../environment/environment";
import { PokemonDetails } from "../../models/pokemon-details.model";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private pokeAPI = environment.pokemonURL;
  private http = inject(HttpClient);

  pokemons = signal<PokemonDetails[]>([]);
  start = signal<number>(0);
  limit: number = 10;

  constructor() {
    // setTimeout(() => {
    this.fetchPokemons().subscribe((pokemons) => {
      this.pokemons.set(pokemons);
      console.log(this.pokemons());
      console.log(this.start());
    });
    // }, 1000);
  }

  fetchPokemons() {
    return this.http
      .get<{
        results: { name: string; url: string }[];
      }>(`${this.pokeAPI}?limit=${this.limit}&offset=${this.start()}`)
      .pipe(
        switchMap((response) => {
          const detailsRequests = response.results.map((pokemon) =>
            this.http.get<PokemonDetails>(pokemon.url),
          );
          this.start.set(this.start() + this.limit);
          return forkJoin(detailsRequests);
        }),
      );
  }

  loadMorePokemons() {
    this.fetchPokemons().subscribe((newPokemons) => {
      this.pokemons.update((pokemons) => [...pokemons, ...newPokemons]);
    });
    console.log(this.start());
  }
}
