import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MatTooltip } from "@angular/material/tooltip";
import { catchError, map, of, switchMap } from "rxjs";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: "app-pokemon-card-big",
  imports: [LoadingSpinnerComponent, MatTooltip],
  templateUrl: "./pokemon-card-big.component.html",
  styleUrl: "./pokemon-card-big.component.scss",
})
export class PokemonCardBigComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private pokemonService = inject(PokemonService);
  private destroyRef = inject(DestroyRef);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);

  private previouslyFocusedElement: HTMLElement | null = null;
  private keydownListener!: () => void;

  pokemonId = input.required<number>();
  showPrior = output<void>();
  showNext = output<void>();
  closeDetail = output<void>();

  pokemon: Pokemon | null = null;
  evolutionChain: any[] = [];
  isLoading = true;
  error: string | null = null;

  statAbbreviations: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "S-ATK",
    "special-defense": "S-DEF",
    speed: "SPD",
  };

  /**
   * The constructor for the `PokemonCardBigComponent` class.
   *
   * Uses the `effect` function from `@angular/core` to set up an effect that will
   * run whenever the component is initialized.
   *
   * The effect checks if a `pokemonId` is set, and if so, calls
   * `loadPokemonDetails` to load the details of the Pokémon with the given ID.
   */
  constructor() {
    effect(() => {
      const id = this.pokemonId();
      if (id) {
        this.loadPokemonDetails();
      }
    });
  }

  /**
   * Called when component is initialized.
   *
   * If `pokemonId` is set, it calls `loadPokemonDetails` to load the details of the
   * Pokémon with the given ID.
   *
   * Also, it stores the element that had focus before opening the dialog, and
   * adds a global event listener for keydown events, so that the component can
   * respond to keyboard events (e.g. closing the dialog when the user presses
   * the Escape key).
   */
  ngOnInit() {
    if (this.pokemonId()) {
      this.loadPokemonDetails();
    }

    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    this.keydownListener = this.renderer.listen(
      "document",
      "keydown",
      (event: KeyboardEvent) => {
        this.handleKeyDown(event);
      },
    );
  }

  /**
   * Loads the details of a Pokémon including its species and evolution chain.
   *
   * This method sets the loading state to true and fetches the Pokémon details
   * using the Pokémon service. It retrieves the Pokémon species and evolution chain
   * data, updating the component's state with this information. In case of an error,
   * it logs the error and sets an error message.
   *
   * It uses RxJS operators to handle asynchronous operations and lifecycle management.
   * The loading state is updated accordingly based on the success or failure of the
   * data fetching operations.
   */
  loadPokemonDetails() {
    this.isLoading = true;

    this.pokemonService
      .fetchPokemon(this.pokemonId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((pokemon) => {
          this.pokemon = pokemon;
          return this.pokemonService.fetchPokemonSpecies(this.pokemonId());
        }),
        switchMap((species) => {
          const evolutionUrl = species.evolution_chain.url;
          return this.pokemonService.fetchEvolutionChain(evolutionUrl);
        }),
        map((evolutionData) => {
          return this.pokemonService.getEvolutionChain(evolutionData.chain);
        }),
        catchError((error) => {
          this.error = "Failed to load Pokémon details";
          console.error(error);
          return of([]);
        }),
      )
      .subscribe({
        next: (evolutions) => {
          this.evolutionChain = evolutions;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = "An error occurred";
          this.isLoading = false;
          console.error(error);
        },
      });
  }

  /**
   * Returns the color associated with the given Pokémon type.
   *
   * If no type is given, it returns a default color of black.
   *
   * @param type The name of the Pokémon type.
   * @returns The hex color code associated with the given type.
   */
  getPokemonTypeColor(type?: string): string {
    if (!type) return "#000000";
    return this.pokemonService.getPokemonTypeColors(type);
  }

  /**
   * Converts a Pokémon name into a more readable format.
   *
   * It capitalizes the first letter of each word in the name, and
   * joins the words back together with a hyphen.
   *
   * @param name The name of the Pokémon.
   * @returns The formatted Pokémon name.
   */
  getPokemonName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  /**
   * Computes an array of Pokémon types with unique slot identifiers.
   *
   * This getter processes the Pokémon's types, and for each type,
   * it creates an object containing the type information along with
   * a unique slot identifier. If a slot is not available, it assigns
   * a fallback identifier based on the index.
   *
   * @returns An array of type objects with unique slot identifiers.
   */
  get uniqueTypes() {
    return (
      this.pokemon?.types.map((type, index) => ({
        ...type,
        uniqueSlot: type.type.slot ?? `fallback-${index}`,
      })) || []
    );
  }

  /**
   * Returns a shortened version of the given stat name.
   *
   * This method takes a stat name and returns a shortened version of it if
   * available, or the original stat name if not. The shortened versions are
   * defined in the statAbbreviations object.
   *
   * @param statName The stat name to shorten.
   * @returns The shortened stat name if available, or the original stat name.
   */
  getShortStatName(statName: string): string {
    return this.statAbbreviations[statName] || statName;
  }

  /**
   * Handles clicks on the detailed Pokémon overlay.
   *
   * If the target element of the click event is not a descendant of the
   * detailed Pokémon card container, it emits the closeDetail event.
   *
   * @param event The click event that triggered the action.
   */
  handleOverlayClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest(".detailed-pokemon-card-container")) {
      this.closeDetail.emit();
    }
  }

  /**
   * Handles keydown events on the detailed Pokémon overlay.
   *
   * Listens for the Escape, ArrowLeft, and ArrowRight keys. If the Escape key
   * is pressed, it emits the closeDetail event. If the ArrowLeft or ArrowRight
   * keys are pressed, it emits the showPrior or showNext event, respectively.
   * The event is prevented from propagating to prevent scrolling.
   *
   * @param event The keydown event that triggered the action.
   */
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.closeDetail || !this.showPrior || !this.showNext) return;

    if (event.key === "Escape") {
      this.closeDetail.emit();
    }

    if (event.key === "ArrowLeft") {
      this.showPrior.emit();
      event.preventDefault();
    }

    if (event.key === "ArrowRight") {
      this.showNext.emit();
      event.preventDefault();
    }
  }

  /**
   * Called after the component's view has been fully initialized.
   *
   * This method sets the tabindex attribute of the detailed Pokémon card container
   * to -1, so that it can receive focus but not be focusable by the user.
   * It also sets the focus to the container element, so that the focus trap can
   * be set up.
   *
   * It then calls the setupFocusTrap method to set up the focus trap.
   */
  ngAfterViewInit(): void {
    const container = this.elementRef.nativeElement.querySelector(
      ".detailed-pokemon-card-container",
    );

    if (container) {
      this.renderer.setAttribute(container, "tabindex", "-1");

      setTimeout(() => {
        container.focus();
      }, 0);
    }

    this.setupFocusTrap();
  }

  /**
   * Sets up a focus trap within the detailed Pokémon card container.
   *
   * This method identifies all focusable elements within the container
   * and listens for "Tab" key events. It ensures that when the user
   * navigates using the "Tab" key, the focus cycles through these
   * elements without exiting the container. If the "Shift" key is
   * held down, it cycles in reverse order. This prevents focus from
   * moving outside the container, maintaining accessibility within
   * the dialog.
   */
  private setupFocusTrap(): void {
    const element = this.elementRef.nativeElement;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      this.renderer.listen(element, "keydown", (event: KeyboardEvent) => {
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      });
    }
  }

  /**
   * Called when the component is destroyed.
   *
   * This method is responsible for returning focus to the element that had focus
   * before the component was opened. It also removes the global event listener
   * that was set up to respond to keyboard events (e.g. closing the dialog when
   * the user presses the Escape key).
   */

  ngOnDestroy(): void {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }

    if (this.keydownListener) {
      this.keydownListener();
    }
  }
}
