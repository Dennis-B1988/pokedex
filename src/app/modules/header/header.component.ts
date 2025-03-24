import { Component, inject } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { Router, RouterLink } from "@angular/router";
import { RegionKey } from "../../core/models/pokemon-details.model";
import { PokemonSearchService } from "../../core/services/pokemon-search/pokemon-search.service";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";

@Component({
  selector: "app-header",
  imports: [MatSelectModule, MatFormFieldModule, MatInputModule, RouterLink],
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

  /**
   * Initializes the component by setting up event listeners.
   *
   * Listens to the window's `resize` event to update the window width
   * variable, and sets up keyboard event listeners to handle the open and
   * close of the menu.
   */
  ngOnInit() {
    window.addEventListener("resize", this.updateWindowWidth);
    this.setupKeyboardListeners();
  }

  /**
   * Called when the component is destroyed.
   *
   * Removes the event listeners for window `resize` and `keydown` events that
   * were set up by the component.
   */
  ngOnDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth);
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  updateWindowWidth = () => {
    this.windowWidth = window.innerWidth;
  };

  /**
   * Sets the current region to the specified region and navigates to the new region's page.
   * Announces the change for accessibility.
   *
   * @param region - The region to switch to.
   */
  selectRegion(region: RegionKey): void {
    this.currentRegion.set(region);
    this.router.navigate(["/region", region]);

    this.announceChange(`Region changed to ${region}`);
  }

  /**
   * Updates the search term and triggers a search for the Pokémon that
   * match the new search term.
   *
   * @param event The input event that triggered the search.
   */
  searchPokemon(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.pokemonSearchService.searchPokemon(inputValue);
  }

  /**
   * Updates the sort method and triggers a re-sort of the Pokémon list.
   *
   * @param event The select change event that triggered the sort.
   */
  sortPokemon(event: MatSelectChange): void {
    this.pokemonService.sort.set(event.value);

    this.announceChange(`Pokémon list sorted by ${event.value}`);
  }

  /**
   * Toggles the menu open or closed state.
   *
   * When called, it will toggle the `menuOpen` property and announce the
   * change for accessibility. If the menu is opened, it will announce
   * "Filter menu opened", and if it is closed, it will announce "Filter menu
   * closed".
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    const message = this.menuOpen ? "Filter menu opened" : "Filter menu closed";
    this.announceChange(message);
  }

  /**
   * Sets up keyboard event listeners for the component.
   */
  private setupKeyboardListeners(): void {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.menuOpen) {
      this.menuOpen = false;
      this.announceChange("Filter menu closed");
    }
  };

  /**
   * Announces the specified message to screen readers for accessibility.
   *
   * It does this by setting the text content of the live region element
   * (which is an element with the attribute `aria-live="polite"`), and
   * then clearing the text content after 5 seconds.
   *
   * @param message The message to announce.
   */
  private announceChange(message: string): void {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
      liveRegion.textContent = message;

      setTimeout(() => {
        if (liveRegion) {
          liveRegion.textContent = "";
        }
      }, 5000);
    }
  }
}
