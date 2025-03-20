import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { PokemonSearchService } from "../../../../core/services/pokemon-search/pokemon-search.service";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardBigComponent } from "./pokemon-card-big/pokemon-card-big.component";
import { PokemonCardsComponent } from "./pokemon-cards/pokemon-cards.component";

@Component({
  selector: "app-pokemon-page",
  imports: [PokemonCardsComponent, RouterModule, PokemonCardBigComponent],
  templateUrl: "./pokemon-page.component.html",
  styleUrl: "./pokemon-page.component.scss",
})
export class PokemonPageComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private pokemonSearchService = inject(PokemonSearchService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  selectedPokemonId = signal<number | null>(null);

  pokemons = this.pokemonService.pokemons;
  currentRegion = this.pokemonService.currentRegion;

  filteredPokemons = this.pokemonSearchService.pokemonList;
  searchTerm = this.pokemonSearchService.searchTerm;
  sort = this.pokemonService.sort;

  /**
   * Returns the range of pokemons for the current region, or null if
   * currentRegion is null.
   *
   * @returns {PokemonRange | null}
   */
  private getCurrentRegionRange() {
    const region = this.currentRegion();
    return this.pokemonService.regionRanges[region];
  }

  /**
   * A computed property that returns the pokemons sorted by the current
   * sort method. If the sort method is "Name", it sorts by name using
   * the localeCompare method. Otherwise, it sorts by id.
   */
  get sortedPokemons() {
    if (this.sort() === "Name") {
      return this.pokemons()
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return this.pokemons()
        .slice()
        .sort((a, b) => a.id - b.id);
    }
  }

  /**
   * When the component is initialized, it will subscribe to the route
   * parameters observable. When the parameters change, it will check
   * if the region parameter is a valid region. If it is, it will
   * tell the PokemonService to change the current region. If it is
   * not a valid region, it will change the current region to "kanto".
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const regionParam = params["region"] as string;

        if (this.pokemonService.isValidRegion(regionParam)) {
          this.pokemonService.changeRegion(regionParam);
        } else {
          this.pokemonService.changeRegion("kanto");
        }
      });
  }

  /**
   * Sets the selected Pokémon ID to the given ID.
   *
   * @param id - The ID of the Pokémon to show details for. This ID will be
   * stored and used to retrieve and display the detailed information of
   * the corresponding Pokémon in the UI.
   */
  showPokemonDetails(id: number) {
    this.selectedPokemonId.set(id);
  }

  /**
   * Shows the details of the Pokémon that comes before the current one in
   * the current region. If the current Pokémon is the first one in the
   * region, it will show the last one in the region instead.
   */
  showPriorPokemonDetails() {
    const currentId = this.selectedPokemonId();
    if (currentId === null) return;

    const range = this.getCurrentRegionRange();
    const minId = range.start + 1;
    const maxId = range.end + 1;

    if (currentId <= minId) {
      this.selectedPokemonId.set(maxId);
    } else {
      this.selectedPokemonId.set(currentId - 1);
    }
  }

  /**
   * Shows the details of the Pokémon that comes after the current one in
   * the current region. If the current Pokémon is the last one in the
   * region, it will show the first one in the region instead.
   */
  showNextPokemonDetails() {
    const currentId = this.selectedPokemonId();
    if (currentId === null) return;

    const range = this.getCurrentRegionRange();
    const minId = range.start + 1;
    const maxId = range.end + 1;

    if (currentId >= maxId) {
      this.selectedPokemonId.set(minId);
    } else {
      this.selectedPokemonId.set(currentId + 1);
    }
  }

  /**
   * Closes the Pokémon details view.
   *
   * This method resets the selected Pokémon ID to null, effectively
   * closing the detailed view of the currently displayed Pokémon.
   */
  closeDetails() {
    this.selectedPokemonId.set(null);
  }
}
