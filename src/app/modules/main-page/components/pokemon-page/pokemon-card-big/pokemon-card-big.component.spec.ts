// import { TestBed } from "@angular/core/testing";
// import { of } from "rxjs";
// import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
// import { PokemonCardBigComponent } from "./pokemon-card-big.component";

// class MockPokemonService {
//   getPokemonTypeColors(type: string) {
//     return (
//       {
//         fire: "#F08030",
//         grass: "#78C850",
//         water: "#6890F0",
//       }[type] || "#000000"
//     );
//   }
// }

// describe("PokemonCardBigComponent (Unit)", () => {
//   let component: PokemonCardBigComponent;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [{ provide: PokemonService, useClass: MockPokemonService }],
//     });

//     component = new PokemonCardBigComponent();
//   });

//   it("should return the correct type color from service", () => {
//     expect(component.getPokemonTypeColor("fire")).toBe("#F08030");
//     expect(component.getPokemonTypeColor("unknown")).toBe("#000000");
//     expect(component.getPokemonTypeColor(undefined)).toBe("#000000");
//   });

//   it("should format Pokémon names properly", () => {
//     expect(component.getPokemonName("mr-mime")).toBe("Mr-Mime");
//     expect(component.getPokemonName("charizard")).toBe("Charizard");
//   });

//   it("should return short stat names if available", () => {
//     expect(component.getShortStatName("special-defense")).toBe("S-DEF");
//     expect(component.getShortStatName("attack")).toBe("ATK");
//     expect(component.getShortStatName("random-stat")).toBe("random-stat");
//   });

//   it("should return unique types with fallback slot IDs", () => {
//     component["pokemon"] = {
//       types: [
//         { type: { name: "fire" }, slot: 1 },
//         { type: { name: "flying" } }, // no slot
//       ],
//     } as any;

//     const result = component.uniqueTypes;
//     expect(result.length).toBe(2);
//     expect(result[0].uniqueSlot).toBe(1);
//     expect(result[1].uniqueSlot).toBe(2); // fallback
//   });
// });

// import { DestroyRef, signal } from "@angular/core";
// import { TestBed } from "@angular/core/testing";
// import { of, throwError } from "rxjs";
// import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
// import { PokemonCardBigComponent } from "./pokemon-card-big.component";

// class MockPokemonService {
//   fetchPokemon(id: number) {
//     return of({ name: "charizard", types: [] });
//   }

//   fetchPokemonSpecies(id: number) {
//     return of({
//       evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
//     });
//   }

//   fetchEvolutionChain(url: string) {
//     return of({ chain: { evolves_to: [] } });
//   }

//   getEvolutionChain(chain: any) {
//     return ["charmander", "charmeleon", "charizard"];
//   }

//   getPokemonTypeColors(type: string) {
//     return "#000000";
//   }
// }

// describe("PokemonCardBigComponent", () => {
//   let component: PokemonCardBigComponent;
//   let service: PokemonService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         { provide: PokemonService, useClass: MockPokemonService },
//         // DestroyRef is required since component uses takeUntilDestroyed
//         { provide: DestroyRef, useValue: {} },
//       ],
//     });

//     component = new PokemonCardBigComponent();
//     service = TestBed.inject(PokemonService);

//     component.pokemonId = 6; // mock charizard
//   });

//   it("should load full Pokémon details successfully", () => {
//     component.loadPokemonDetails();

//     expect(component.isLoading).toBe(false);
//     expect(component.pokemon).toEqual(
//       jasmine.objectContaining({ name: "charizard" }),
//     );
//     expect(component.evolutionChain).toEqual([
//       "charmander",
//       "charmeleon",
//       "charizard",
//     ]);
//     expect(component.error).toBeNull();
//   });

//   it("should set error message if fetch fails", () => {
//     spyOn(service, "fetchPokemon").and.returnValue(
//       throwError(() => new Error("Network error")),
//     );

//     component.loadPokemonDetails();

//     expect(component.isLoading).toBe(false);
//     expect(component.error).toBe("Failed to load Pokémon details");
//     expect(component.evolutionChain).toEqual([]);
//   });
// });
