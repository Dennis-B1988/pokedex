import { Component, inject } from "@angular/core";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "./components/pokemon-cards/pokemon-cards.component";

@Component({
  selector: "app-main-page",
  imports: [PokemonCardsComponent],
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
    // setTimeout(() => {
    console.log(this.pokemonService.isLoading());
    // }, 1500);
  }
}
