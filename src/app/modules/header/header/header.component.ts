import { Component, inject, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { Router } from "@angular/router";
import { RegionKey } from "../../../core/models/pokemon-details.model";
import { PokemonSearchService } from "../../../core/services/pokemon-search/pokemon-search.service";
import { PokemonService } from "../../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-header",
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private pokemonService = inject(PokemonService);
  private pokemonSearchService = inject(PokemonSearchService);
  private router = inject(Router);

  searchTerm = this.pokemonSearchService.searchTerm;
  isLoading = this.pokemonService.isLoading;
  menuOpen: boolean = false;
  windowWidth: number = window.innerWidth;
  sort = this.pokemonService.sort;
  currentRegion = this.pokemonService.currentRegion;

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

  ngOnInit() {
    window.addEventListener("resize", this.updateWindowWidth);
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth);
  }

  updateWindowWidth = () => {
    this.windowWidth = window.innerWidth;
  };

  selectRegion(region: RegionKey): void {
    this.currentRegion.set(region);
    this.router.navigate(["/region", region]);
    console.log(this.currentRegion());
  }

  searchPokemon(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.pokemonSearchService.searchPokemon(inputValue);

    console.log("Input value:", inputValue);
    console.log("Search term:", this.searchTerm());
  }

  sortPokemon(event: MatSelectChange): void {
    this.pokemonService.sort.set(event.value);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
