import { HttpClient } from "@angular/common/http";
import {
  computed,
  DestroyRef,
  inject,
  Injectable,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, finalize, forkJoin, Observable, of } from "rxjs";
import { environment } from "../../../../environment/environment.prod";
import {
  Pokemon,
  pokemonTypeColors,
  RegionKey,
} from "../../models/pokemon-details.model";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private destroyRef = inject(DestroyRef);
  private pokeAPI = environment.pokemonURL;
  private pokeSpeciesAPI = environment.pokemonSpeciesURL;
  private pokeImageAPI = environment.pokemonImageURL;

  private pokemonCache: Record<string, Pokemon[]> = {};

  pokemons = signal<Pokemon[]>([]);
  isLoading = signal<boolean>(false);

  sort = signal<string>("ID");

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

  constructor(private http: HttpClient) {}

  /**
   * Given a URL, returns the ID of the Pokemon from the URL.
   * e.g. Given the URL 'https://pokeapi.co/api/v2/pokemon/25/', returns 25.
   * @param url - The URL containing the Pokemon ID.
   * @returns The Pokemon ID as a number.
   */
  private getIdFromUrl(url: string): number {
    const parts = url.split("/");
    return parseInt(parts[parts.length - 2]);
  }

  /**
   * Fetches detailed information about a specific Pokémon by its ID.
   *
   * @param id - The unique identifier of the Pokémon to fetch.
   * @returns An observable containing the Pokémon details.
   */
  fetchPokemon(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.pokeAPI}/${id}`);
  }

  fetchPokemonSpecies(id: number): Observable<any> {
    return this.http.get(`${this.pokeSpeciesAPI}/${id}/`);
  }

  fetchEvolutionChain(url: string): Observable<any> {
    return this.http.get(url);
  }

  /**
   * Fetches a range of Pokémon by their IDs and stores the data in the service.
   *
   * @param start - The starting ID of the range of Pokémon to fetch.
   * @param end - The ending ID of the range of Pokémon to fetch.
   *
   * This method caches the results using the start and end IDs as a key.
   * If the data has been fetched before, it will return the cached data.
   * If the data has not been fetched before, it will fetch the data and store it in the cache.
   * The data is stored in the `pokemonCache` property as an array of `Pokemon` objects.
   * The data is also emitted as an observable via the `pokemons` property.
   * The `isLoading` property is set to true while the data is being fetched and false when the data is available.
   */
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
          console.error(error);
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
        error: (err) => console.error("Failed to fetch Pokémon", err),
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Recursively constructs the evolution chain of a Pokémon.
   *
   * This function takes a Pokémon evolution chain object and returns
   * an array of objects representing each stage in the evolution chain.
   * Each object contains the Pokémon's name, ID, and image URL.
   *
   * @param chain - The evolution chain object containing species and evolution
   *                information.
   * @returns An array of objects, each representing a stage in the Pokémon
   *          evolution chain with the structure: { name, id, image }.
   */
  getEvolutionChain(chain: any): any[] {
    const evolutions: any[] = [];

    const baseForm = {
      name: chain.species.name,
      id: this.getIdFromUrl(chain.species.url),
      image: `${this.pokeImageAPI}/${this.getIdFromUrl(chain.species.url)}.png`,
    };

    evolutions.push(baseForm);

    if (chain.evolves_to && chain.evolves_to.length > 0) {
      chain.evolves_to.forEach((evolution: any) => {
        evolutions.push(...this.getEvolutionChain(evolution));
      });
    }

    return evolutions;
  }

  /**
   * Determines if the given region is a valid region.
   *
   * @param region - The region to check.
   * @returns true if the given region is a valid region, false otherwise.
   */
  isValidRegion(region: string): region is RegionKey {
    return Object.keys(this.regionRanges).includes(region);
  }

  /**
   * Changes the current region to the given region and loads the Pokémon
   * data for that region.
   *
   * @param region - The region to change to.
   */
  changeRegion(region: RegionKey): void {
    this.currentRegion.set(region);
    const regionData = this.regionRanges[region];
    this.loadPokemons(regionData.start, regionData.end);
  }

  /**
   * Returns the color associated with the given Pokémon type.
   *
   * If no type is given, it returns a default color of black.
   *
   * @param type The name of the Pokémon type.
   * @returns The hex color code associated with the given type.
   */
  getPokemonTypeColors(color: string): string {
    if (!color) return "";
    const baseColor =
      pokemonTypeColors[color as keyof typeof pokemonTypeColors] || "";

    return baseColor ? `#${baseColor}cc` : "";
  }
}
