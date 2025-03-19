import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  output,
  Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { catchError, map, of, switchMap } from "rxjs";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: "app-pokemon-card-big",
  imports: [LoadingSpinnerComponent],
  templateUrl: "./pokemon-card-big.component.html",
  styleUrl: "./pokemon-card-big.component.scss",
})
export class PokemonCardBigComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private destroyRef = inject(DestroyRef);

  pokemonId = input.required<number>();
  showPrior = output<void>();
  showNext = output<void>();
  closeDetail = output<void>();

  pokemon: any;
  evolutionChain: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor() {
    effect(() => {
      const id = this.pokemonId();
      if (id) {
        this.loadPokemonDetails();
      }
    });
  }

  ngOnInit() {
    if (this.pokemonId()) {
      this.loadPokemonDetails();
    }
  }

  loadPokemonDetails() {
    this.isLoading = true;

    // First get the Pokémon details
    this.pokemonService
      .fetchPokemon(this.pokemonId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((pokemon) => {
          this.pokemon = pokemon;
          // Then get the species data which contains the evolution chain URL
          return this.pokemonService.fetchPokemonSpecies(this.pokemonId());
        }),
        switchMap((species) => {
          // Now get the evolution chain using the URL from species
          const evolutionUrl = species.evolution_chain.url;
          return this.pokemonService.fetchEvolutionChain(evolutionUrl);
        }),
        map((evolutionData) => {
          // Process the evolution chain
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

  getPokemonTypeColor(type: string): string {
    return this.pokemonService.getPokemonTypeColors(type);
  }

  // formatPokemonName(name: string): string {
  //   if (!name) return "";
  //   return name
  //     .split("-")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join("-");
  // }
}
