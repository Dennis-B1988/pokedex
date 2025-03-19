import { Component, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-pokemon-cards",
  imports: [MatTooltipModule],
  templateUrl: "./pokemon-cards.component.html",
  styleUrl: "./pokemon-cards.component.scss",
})
export class PokemonCardsComponent {
  pokemonService = inject(PokemonService);

  pokemon = input<Pokemon>();
  // isLoading = this.pokemonService.isLoading;

  // pokemonName(name: string): string {
  //   return this.pokemonService.formatPokemonName(name);
  // }

  pokemonTypeColors(color: string): string {
    return this.pokemonService.getPokemonTypeColors(color);
  }

  getBoxShadowStyle(): string {
    const primaryType = this.pokemon()?.types?.[0]?.type?.name || "";
    const secondaryType = this.pokemon()?.types?.[1]?.type?.name;

    const primaryColor = this.pokemonTypeColors(primaryType);

    if (!secondaryType) {
      return `0rem 0rem 0.625rem 0.625rem ${primaryColor}`;
    }

    const secondaryColor = this.pokemonTypeColors(secondaryType);

    return `-0.3rem -0.3rem 0.625rem 0.3rem ${primaryColor}, 0.3rem 0.3rem 0.625rem 0.3rem ${secondaryColor}`;
  }
}
