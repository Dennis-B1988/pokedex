import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";

@Component({
  selector: "app-main-page",
  imports: [RouterOutlet, LoadingSpinnerComponent],
  templateUrl: "./main-page.component.html",
  styleUrl: "./main-page.component.scss",
})
export class MainPageComponent {
  pokemonService = inject(PokemonService);

  pokemons = this.pokemonService.pokemons;
  isLoading = this.pokemonService.isLoading;

  constructor() {
    setTimeout(() => {
      console.log(this.pokemons());
    }, 3000);
  }
}
