import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "../pokemon-cards/pokemon-cards.component";

@Component({
  selector: "app-pokemon-page",
  imports: [PokemonCardsComponent, RouterModule],
  templateUrl: "./pokemon-page.component.html",
  styleUrl: "./pokemon-page.component.scss",
})
export class PokemonPageComponent implements OnInit {
  pokemonService = inject(PokemonService);
  route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  pokemons = this.pokemonService.pokemons;
  currentRegion = this.pokemonService.currentRegion;

  ngOnInit(): void {
    const subscribe = this.route.params.subscribe((params) => {
      const regionParam = params["region"] as string;

      if (this.pokemonService.isValidRegion(regionParam)) {
        this.pokemonService.changeRegion(regionParam);
      } else {
        this.pokemonService.changeRegion("kanto");
      }
    });

    this.destroyRef.onDestroy(() => subscribe.unsubscribe());
  }
}
