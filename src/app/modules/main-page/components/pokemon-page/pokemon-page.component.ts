import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
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

  private getCurrentRegionRange() {
    const region = this.currentRegion();
    return this.pokemonService.regionRanges[region];
  }

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

  showPokemonDetails(id: number) {
    this.selectedPokemonId.set(id);
  }

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

  closeDetails() {
    this.selectedPokemonId.set(null);
    console.log(this.selectedPokemonId());
  }
}
