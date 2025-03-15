import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { RegionKey } from "../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-header",
  imports: [MatSelectModule, MatFormFieldModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  currentRegion = this.pokemonService.currentRegion;
  isLoading = this.pokemonService.isLoading;

  regions: RegionKey[] = Object.keys(
    this.pokemonService.regionRanges,
  ) as RegionKey[];

  constructor() {
    console.log(this.regions);
  }

  selectRegion(region: RegionKey): void {
    this.router.navigate(["/region", region]);
  }
}
