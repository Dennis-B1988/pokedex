import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { RegionKey } from "../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-header",
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  isLoading = this.pokemonService.isLoading;

  regions: RegionKey[] = Object.keys(
    this.pokemonService.regionRanges,
  ) as RegionKey[];
  currentRegion = this.pokemonService.currentRegion;

  selectRegion(region: RegionKey): void {
    // Navigate to the selected region
    this.router.navigate(["/region", region]);
  }
}
