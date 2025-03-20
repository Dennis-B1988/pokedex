import { Component, inject, input } from "@angular/core";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-pokemon-cards",
  imports: [],
  templateUrl: "./pokemon-cards.component.html",
  styleUrl: "./pokemon-cards.component.scss",
})
export class PokemonCardsComponent {
  pokemonService = inject(PokemonService);

  pokemon = input<Pokemon>();

  pokemonTypeColors(color: string): string {
    return this.pokemonService.getPokemonTypeColors(color);
  }

  /**
   * Returns a box-shadow style string that is used to style the Pokémon card.
   *
   * If the Pokémon has a single type, the box shadow is just the primary color.
   * If the Pokémon has a secondary type, the box shadow is a combination of the
   * primary and secondary colors.
   *
   * @returns A box-shadow style string.
   */
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
