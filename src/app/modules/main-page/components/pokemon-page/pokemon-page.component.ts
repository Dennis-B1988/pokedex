import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardBigComponent } from "../pokemon-card-big/pokemon-card-big.component";
import { PokemonCardsComponent } from "../pokemon-cards/pokemon-cards.component";

@Component({
  selector: "app-pokemon-page",
  imports: [PokemonCardsComponent, RouterModule, PokemonCardBigComponent],
  templateUrl: "./pokemon-page.component.html",
  styleUrl: "./pokemon-page.component.scss",
})
export class PokemonPageComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  pokemons = this.pokemonService.pokemons;
  currentRegion = this.pokemonService.currentRegion;

  selectedPokemonId = signal<number | null>(null);

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

    if (currentId === minId) return;

    this.selectedPokemonId.set(this.selectedPokemonId()! - 1);
    console.log(this.selectedPokemonId());
  }

  showNextPokemonDetails() {
    const currentId = this.selectedPokemonId();
    if (currentId === null) return;

    const range = this.getCurrentRegionRange();
    const maxId = range.end + 1;

    if (currentId === maxId) return;

    this.selectedPokemonId.set(this.selectedPokemonId()! + 1);
    console.log(this.selectedPokemonId());
  }

  closeDetails() {
    this.selectedPokemonId.set(null);
    console.log(this.selectedPokemonId());
  }
}
