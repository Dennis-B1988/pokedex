import { Component, inject, signal } from "@angular/core";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "../pokemon-cards/pokemon-cards.component";

@Component({
  selector: "app-pokemon-page",
  imports: [PokemonCardsComponent],
  templateUrl: "./pokemon-page.component.html",
  styleUrl: "./pokemon-page.component.scss",
})
export class PokemonPageComponent {
  pokemonService = inject(PokemonService);

  pokemons = this.pokemonService.pokemons;

  region: string = "";
  regionTitle: string = "Kanto Region";
  startingPokemon: number = 0;
  endingPokemon: number = 0;

  regionRanges = {
    kanto: { start: 0, end: 151, title: "Kanto Region" },
    johto: { start: 151, end: 251, title: "Johto Region" },
    hoenn: { start: 251, end: 386, title: "Hoenn Region" },
    sinnoh: { start: 386, end: 493, title: "Sinnoh Region" },
    unova: { start: 493, end: 649, title: "Unova Region" },
    kalos: { start: 649, end: 721, title: "Kalos Region" },
    alola: { start: 721, end: 809, title: "Alola Region" },
    galar: { start: 809, end: 898, title: "Galar Region" },
  };
}
