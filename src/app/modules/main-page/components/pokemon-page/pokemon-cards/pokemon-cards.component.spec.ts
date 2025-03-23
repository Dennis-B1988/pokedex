import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "./pokemon-cards.component";

describe("PokemonCardsComponent", () => {
  let component: PokemonCardsComponent;
  let fixture: ComponentFixture<PokemonCardsComponent>;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;

  // Create complete mock Pokemon objects that match the interface
  const mockPokemonSingleType: Pokemon = {
    id: 1,
    name: "bulbasaur",
    types: [
      {
        type: {
          name: "grass",
          slot: 1,
        },
      },
    ],
    stats: [
      {
        base_stat: 45,
        stat: { name: "hp" },
      },
    ],
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://example.com/bulbasaur.png",
        },
      },
    },
  };

  const mockPokemonDualType: Pokemon = {
    id: 1,
    name: "bulbasaur",
    types: [
      {
        type: {
          name: "grass",
          slot: 1,
        },
      },
      {
        type: {
          name: "poison",
          slot: 2,
        },
      },
    ],
    stats: [
      {
        base_stat: 45,
        stat: { name: "hp" },
      },
    ],
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://example.com/bulbasaur.png",
        },
      },
    },
  };

  beforeEach(async () => {
    // Create spy for PokemonService
    pokemonServiceSpy = jasmine.createSpyObj("PokemonService", [
      "getPokemonTypeColors",
    ]);

    // Set up the spy's mock return values
    pokemonServiceSpy.getPokemonTypeColors.and.callFake((color: string) => {
      const colors: Record<string, string> = {
        grass: "#78C850cc",
        poison: "#A040A0cc",
      };
      return colors[color] || "";
    });

    await TestBed.configureTestingModule({
      imports: [PokemonCardsComponent],
      providers: [{ provide: PokemonService, useValue: pokemonServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("pokemonTypeColors", () => {
    it("should call pokemonService.getPokemonTypeColors with the provided color", () => {
      component.pokemonTypeColors("grass");
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith(
        "grass",
      );
    });

    it("should return the correct color from the service", () => {
      const result = component.pokemonTypeColors("grass");
      expect(result).toBe("#78C850cc");
    });
  });

  describe("getBoxShadowStyle", () => {
    it("should return a single-color box shadow for a Pokemon with one type", () => {
      // Set the pokemon input signal using setInput
      TestBed.runInInjectionContext(() => {
        // We need to hack this a bit since we can't directly assign to input signals in tests
        Object.defineProperty(component, "pokemon", {
          value: signal(mockPokemonSingleType),
        });
      });

      // Call the getBoxShadowStyle method
      const result = component.getBoxShadowStyle();

      // Verify the service was called with the correct type
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith(
        "grass",
      );

      // Verify the returned box shadow string is correct
      expect(result).toBe("0rem 0rem 0.625rem 0.625rem #78C850cc");
    });

    it("should return a dual-color box shadow for a Pokemon with two types", () => {
      // Set the pokemon input signal
      TestBed.runInInjectionContext(() => {
        Object.defineProperty(component, "pokemon", {
          value: signal(mockPokemonDualType),
        });
      });

      // Call the getBoxShadowStyle method
      const result = component.getBoxShadowStyle();

      // Verify the service was called with both types
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith(
        "grass",
      );
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith(
        "poison",
      );

      // Verify the returned box shadow string is correct
      expect(result).toBe(
        "-0.3rem -0.3rem 0.625rem 0.3rem #78C850cc, 0.3rem 0.3rem 0.625rem 0.3rem #A040A0cc",
      );
    });

    it("should handle a Pokemon with no types", () => {
      // Create a Pokemon with no types
      const noTypesPokemon: Pokemon = {
        ...mockPokemonSingleType,
        types: [],
      };

      // Set the pokemon input signal
      TestBed.runInInjectionContext(() => {
        Object.defineProperty(component, "pokemon", {
          value: signal(noTypesPokemon),
        });
      });

      // Call the getBoxShadowStyle method
      const result = component.getBoxShadowStyle();

      // Verify the service was called with empty string
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith("");

      // Verify the returned box shadow string has default color
      expect(result).toBe("0rem 0rem 0.625rem 0.625rem ");
    });

    it("should handle undefined pokemon", () => {
      // Set the pokemon input signal to undefined
      TestBed.runInInjectionContext(() => {
        Object.defineProperty(component, "pokemon", {
          value: signal(undefined),
        });
      });

      // Call the getBoxShadowStyle method
      const result = component.getBoxShadowStyle();

      // Verify the service was called with empty string
      expect(pokemonServiceSpy.getPokemonTypeColors).toHaveBeenCalledWith("");

      // Verify the returned box shadow string has default color
      expect(result).toBe("0rem 0rem 0.625rem 0.625rem ");
    });
  });
});
