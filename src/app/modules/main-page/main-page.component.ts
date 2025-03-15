import { Component, inject, input } from "@angular/core";
import { PokemonDetails } from "../../core/models/pokemon-details.model";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-main-page",
  imports: [],
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
    this.pokemonService.loadMorePokemons();
    console.log(this.pokemons());
  }
}
