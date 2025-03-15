import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-main-page",
  imports: [RouterOutlet],
  templateUrl: "./main-page.component.html",
  styleUrl: "./main-page.component.scss",
})
export class MainPageComponent {
  pokemonService = inject(PokemonService);

  pokemons = this.pokemonService.pokemons;

  constructor() {
    setTimeout(() => {
      console.log(this.pokemons());
    }, 3000);
  }

  loadMorePokemons() {
    // this.pokemonService.loadMorePokemons();
    console.log(this.pokemons());
    // setTimeout(() => {
    console.log(this.pokemonService.isLoading());
    // }, 1500);
  }
}
