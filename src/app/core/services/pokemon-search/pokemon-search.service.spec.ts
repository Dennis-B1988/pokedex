import { TestBed } from "@angular/core/testing";
import { Pokemon } from "../../models/pokemon-details.model";
import { PokemonService } from "../pokemon/pokemon.service";
import { PokemonSearchService } from "./pokemon-search.service";

describe("PokemonSearchService", () => {
  let service: PokemonSearchService;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;

  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: "Bulbasaur",
      types: [{ type: { name: "grass", slot: 1 } }],
      stats: [{ base_stat: 45, stat: { name: "hp" } }],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "bulbasaur.png",
          },
        },
      },
    },
    {
      id: 25,
      name: "Pikachu",
      types: [{ type: { name: "electric", slot: 1 } }],
      stats: [{ base_stat: 35, stat: { name: "hp" } }],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "pikachu.png",
          },
        },
      },
    },
  ];

  beforeEach(() => {
    // Create a spy for PokemonService
    const pokemonSpy = jasmine.createSpyObj("PokemonService", [], {
      // Mock the pokemons signal as a function that returns the mock data
      pokemons: jasmine.createSpy("pokemons").and.returnValue(mockPokemons),
    });

    TestBed.configureTestingModule({
      providers: [
        PokemonSearchService,
        { provide: PokemonService, useValue: pokemonSpy },
      ],
    });

    service = TestBed.inject(PokemonSearchService);
    pokemonServiceSpy = TestBed.inject(
      PokemonService,
    ) as jasmine.SpyObj<PokemonService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should initialize with empty pokemon list and search term", () => {
    expect(service.pokemonList()).toEqual([]);
    expect(service.searchTerm()).toBe("");
  });

  it("should set pokemonList to empty array when search term is empty", () => {
    // Arrange
    service.pokemonList.set(mockPokemons); // Set some initial data

    // Act
    service.searchPokemon("");

    // Assert
    expect(service.searchTerm()).toBe("");
    expect(service.pokemonList()).toEqual([]);
  });

  it("should filter pokemons by name (case insensitive)", () => {
    // Act
    service.searchPokemon("piKa");

    // Assert
    expect(service.searchTerm()).toBe("piKa");
    expect(service.pokemonList()).toEqual([mockPokemons[1]]);
    expect(pokemonServiceSpy.pokemons).toHaveBeenCalled();
  });

  it("should filter pokemons by ID", () => {
    // Act
    service.searchPokemon("1");

    // Assert
    expect(service.searchTerm()).toBe("1");
    expect(service.pokemonList()).toEqual([mockPokemons[0]]);
  });

  it("should return multiple results when search term matches multiple pokemons", () => {
    // Arrange
    const multiSearchMockPokemons: Pokemon[] = [
      {
        id: 1,
        name: "Bulbasaur",
        types: [{ type: { name: "grass", slot: 1 } }],
        stats: [{ base_stat: 45, stat: { name: "hp" } }],
        sprites: {
          other: {
            "official-artwork": {
              front_default: "bulbasaur.png",
            },
          },
        },
      },
      {
        id: 152,
        name: "Chikorita",
        types: [{ type: { name: "grass", slot: 1 } }],
        stats: [{ base_stat: 45, stat: { name: "hp" } }],
        sprites: {
          other: {
            "official-artwork": {
              front_default: "chikorita.png",
            },
          },
        },
      },
    ];

    // Override the spy's return value just for this test
    (pokemonServiceSpy.pokemons as jasmine.Spy).and.returnValue(
      multiSearchMockPokemons,
    );

    // Act
    service.searchPokemon("a");

    // Assert
    expect(service.searchTerm()).toBe("a");
    expect(service.pokemonList()).toEqual(multiSearchMockPokemons);
  });

  it("should return empty array when no matches are found", () => {
    // Act
    service.searchPokemon("mewtwo");

    // Assert
    expect(service.searchTerm()).toBe("mewtwo");
    expect(service.pokemonList()).toEqual([]);
  });
});
