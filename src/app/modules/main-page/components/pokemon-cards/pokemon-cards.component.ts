import { Component, inject, input } from "@angular/core";
import {
  Pokemon,
  PokemonDetails,
} from "../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-pokemon-cards",
  imports: [],
  templateUrl: "./pokemon-cards.component.html",
  styleUrl: "./pokemon-cards.component.scss",
})
export class PokemonCardsComponent {
  pokemonService = inject(PokemonService);

  pokemon = input<Pokemon>();
  isLoading = this.pokemonService.isLoading;
}
