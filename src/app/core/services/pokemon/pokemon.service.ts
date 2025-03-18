import { HttpClient } from "@angular/common/http";
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  catchError,
  finalize,
  forkJoin,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { environment } from "../../../../environment/environment";
import {
  Pokemon,
  PokemonDetails,
  pokemonTypeColors,
  RegionKey,
} from "../../models/pokemon-details.model";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private pokeAPI = environment.pokemonURL;
  private pokeSpeciesAPI = environment.pokemonSpeciesURL;
  private pokeImageAPI = environment.pokemonImageURL;

  private pokemonCache: Record<string, Pokemon[]> = {};

  pokemons = signal<Pokemon[]>([]);
  isLoading = signal<boolean>(false);

  currentRegion = signal<RegionKey>("kanto");

  regionRanges = {
    kanto: { start: 0, end: 150, title: "Kanto Region" },
    johto: { start: 151, end: 250, title: "Johto Region" },
    hoenn: { start: 251, end: 385, title: "Hoenn Region" },
    sinnoh: { start: 386, end: 492, title: "Sinnoh Region" },
    unova: { start: 493, end: 648, title: "Unova Region" },
    kalos: { start: 649, end: 720, title: "Kalos Region" },
    alola: { start: 721, end: 808, title: "Alola Region" },
    galar: { start: 809, end: 897, title: "Galar Region" },
  };

  currentRegionRange = computed(() => this.regionRanges[this.currentRegion()]);

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
      this.fetchPokemon(start + i + 1).pipe(
        catchError((error) => {
          console.log(error);
          return of({} as Pokemon);
        }),
      ),
    );

    forkJoin(pokemonRequests)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (pokemonData) => {
          const validPokemon = pokemonData.filter(
            (p) => Object.keys(p).length > 0,
          );
          this.pokemonCache[cacheKey] = validPokemon;
          this.pokemons.set(pokemonData);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  // Add methods to check if a region is valid
  isValidRegion(region: string): region is RegionKey {
    return Object.keys(this.regionRanges).includes(region);
  }

  // Method to change region
  changeRegion(region: RegionKey): void {
    this.currentRegion.set(region);
    const regionData = this.regionRanges[region];
    this.loadPokemons(regionData.start, regionData.end);
  }

  // formatPokemonName(name: string): string {
  //   if (!name) return "";

  //   return name
  //     .split("-")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join("-");
  // }

  getPokemonTypeColors(color: string): string {
    if (!color) return "";
    const baseColor =
      pokemonTypeColors[color as keyof typeof pokemonTypeColors] || "";

    return baseColor ? `#${baseColor}cc` : "";
  }

  // In PokemonService
  fetchPokemonSpecies(id: number): Observable<any> {
    return this.http.get(`${this.pokeSpeciesAPI}/${id}/`);
  }

  fetchEvolutionChain(url: string): Observable<any> {
    return this.http.get(url);
  }

  // Helper method to process the evolution chain response
  getEvolutionChain(chain: any): any[] {
    const evolutions: any[] = [];

    // Process first form
    const baseForm = {
      name: chain.species.name,
      id: this.getIdFromUrl(chain.species.url),
      image: `${this.pokeImageAPI}/${this.getIdFromUrl(chain.species.url)}.png`,
    };

    evolutions.push(baseForm);

    // Process evolutions recursively
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution: any) => {
        evolutions.push(...this.getEvolutionChain(evolution));
      });
    }

    return evolutions;
  }

  // Extract the Pokémon ID from the species URL
  private getIdFromUrl(url: string): number {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 2]);
  }
}
