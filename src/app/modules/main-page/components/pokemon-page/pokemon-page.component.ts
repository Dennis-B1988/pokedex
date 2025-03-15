import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "../pokemon-cards/pokemon-cards.component";

type RegionKey =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar";

@Component({
  selector: "app-pokemon-page",
  imports: [PokemonCardsComponent, RouterModule],
  templateUrl: "./pokemon-page.component.html",
  styleUrl: "./pokemon-page.component.scss",
})
export class PokemonPageComponent implements OnInit {
  pokemonService = inject(PokemonService);
  route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  pokemons = this.pokemonService.pokemons;

  region: RegionKey = "kanto";
  regionTitle: string = "Kanto Region";
  startingPokemon: number = 0;
  endingPokemon: number = 0;

  regionRanges = {
    kanto: { start: 0, end: 150, title: "Kanto Region" },
    johto: { start: 151, end: 250, title: "Johto Region" },
    hoenn: { start: 251, end: 385, title: "Hoenn Region" },
    sinnoh: { start: 386, end: 492, title: "Sinnoh Region" },
    unova: { start: 493, end: 648, title: "Unova Region" },
    kalos: { start: 649, end: 720, title: "Kalos Region" },
    alola: { start: 721, end: 808, title: "Alola Region" },
    galar: { start: 809, end: 897, title: "Galar Region" },
  };

  ngOnInit(): void {
    const subscribe = this.route.params.subscribe((params) => {
      const regionParam = params["region"] as string;

      if (this.isValidRegion(regionParam)) {
        this.region = regionParam as RegionKey;
      } else {
        this.region = "kanto";
      }

      const regionData = this.regionRanges[this.region];
      this.regionTitle = regionData.title;
      this.startingPokemon = regionData.start;
      this.endingPokemon = regionData.end;

      this.loadRegionPokemon();
    });

    this.destroyRef.onDestroy(() => subscribe.unsubscribe());
  }

  loadRegionPokemon() {
    this.pokemonService.loadPokemons(this.startingPokemon, this.endingPokemon);
  }

  isValidRegion(region: string): region is RegionKey {
    return Object.keys(this.regionRanges).includes(region);
  }
}
