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

  isLoading = this.pokemonService.isLoading;
  currentRegion = this.pokemonService.currentRegion;
  // regionRange = this.pokemonService.regionRanges[this.regionRange.start];

  regionsWithRange = Object.entries(this.pokemonService.regionRanges).map(
    ([region, range]) => ({
      name: region as RegionKey,
      start: range.start + 1,
      end: range.end + 1,
    }),
  );

  constructor() {
    console.log(this.regionsWithRange);
  }

  selectRegion(region: RegionKey): void {
    this.router.navigate(["/region", region]);
  }
}
