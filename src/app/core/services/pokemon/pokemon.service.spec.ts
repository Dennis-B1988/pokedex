import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { environment } from "../../../../environment/environment.prod";
import { Pokemon } from "../../models/pokemon-details.model";
import { PokemonService } from "./pokemon.service";

describe("PokemonService", () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  const mockPokemon: Pokemon = {
    id: 25,
    name: "pikachu",
    types: [{ type: { name: "electric", slot: 1 } }],
    stats: [
      { base_stat: 35, stat: { name: "hp" } },
      { base_stat: 55, stat: { name: "attack" } },
    ],
    sprites: {
      other: {
        "official-artwork": {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
        },
      },
    },
  };

  const mockSpeciesResponse = {
    flavor_text_entries: [
      { flavor_text: "Test description", language: { name: "en" } },
    ],
    evolution_chain: {
      url: "https://pokeapi.co/api/v2/evolution-chain/10/",
    },
  };

  const mockEvolutionChainResponse = {
    chain: {
      species: {
        name: "pichu",
        url: "https://pokeapi.co/api/v2/pokemon-species/172/",
      },
      evolves_to: [
        {
          species: {
            name: "pikachu",
            url: "https://pokeapi.co/api/v2/pokemon-species/25/",
          },
          evolves_to: [
            {
              species: {
                name: "raichu",
                url: "https://pokeapi.co/api/v2/pokemon-species/26/",
              },
              evolves_to: [],
            },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("fetchPokemon", () => {
    it("should fetch pokemon by id", () => {
      service.fetchPokemon(25).subscribe((pokemon) => {
        expect(pokemon).toEqual(mockPokemon);
      });

      const req = httpMock.expectOne(`${environment.pokemonURL}/25`);
      expect(req.request.method).toBe("GET");
      req.flush(mockPokemon);
    });
  });

  describe("fetchPokemonSpecies", () => {
    it("should fetch pokemon species by id", () => {
      service.fetchPokemonSpecies(25).subscribe((species) => {
        expect(species).toEqual(mockSpeciesResponse);
      });

      const req = httpMock.expectOne(`${environment.pokemonSpeciesURL}/25/`);
      expect(req.request.method).toBe("GET");
      req.flush(mockSpeciesResponse);
    });
  });

  describe("fetchEvolutionChain", () => {
    it("should fetch evolution chain by url", () => {
      const url = "https://pokeapi.co/api/v2/evolution-chain/10/";

      service.fetchEvolutionChain(url).subscribe((chain) => {
        expect(chain).toEqual(mockEvolutionChainResponse);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe("GET");
      req.flush(mockEvolutionChainResponse);
    });
  });

  describe("loadPokemons", () => {
    it("should load pokemons within a range and update signals", fakeAsync(() => {
      // Setup spies
      spyOn(service, "fetchPokemon").and.callThrough();

      // Initial state
      expect(service.pokemons()).toEqual([]);
      expect(service.isLoading()).toBeFalse();

      // Call the method
      service.loadPokemons(0, 2);

      // Should be loading
      expect(service.isLoading()).toBeTrue();

      // Should call fetchPokemon for each pokemon in range
      expect(service.fetchPokemon).toHaveBeenCalledWith(1);
      expect(service.fetchPokemon).toHaveBeenCalledWith(2);
      expect(service.fetchPokemon).toHaveBeenCalledWith(3);

      // Respond to requests
      const req1 = httpMock.expectOne(`${environment.pokemonURL}/1`);
      const req2 = httpMock.expectOne(`${environment.pokemonURL}/2`);
      const req3 = httpMock.expectOne(`${environment.pokemonURL}/3`);

      const mockPokemon1 = { ...mockPokemon, id: 1, name: "bulbasaur" };
      const mockPokemon2 = { ...mockPokemon, id: 2, name: "ivysaur" };
      const mockPokemon3 = { ...mockPokemon, id: 3, name: "venusaur" };

      req1.flush(mockPokemon1);
      req2.flush(mockPokemon2);
      req3.flush(mockPokemon3);

      // Wait for completion
      tick();

      // Should update signals
      expect(service.isLoading()).toBeFalse();
      expect(service.pokemons().length).toBe(3);
      expect(service.pokemons()[0].name).toBe("bulbasaur");
      expect(service.pokemons()[1].name).toBe("ivysaur");
      expect(service.pokemons()[2].name).toBe("venusaur");
    }));

    it("should use cached data when available", fakeAsync(() => {
      // First load to populate cache
      service.loadPokemons(0, 2);

      const req1 = httpMock.expectOne(`${environment.pokemonURL}/1`);
      const req2 = httpMock.expectOne(`${environment.pokemonURL}/2`);
      const req3 = httpMock.expectOne(`${environment.pokemonURL}/3`);

      const mockPokemon1 = { ...mockPokemon, id: 1, name: "bulbasaur" };
      const mockPokemon2 = { ...mockPokemon, id: 2, name: "ivysaur" };
      const mockPokemon3 = { ...mockPokemon, id: 3, name: "venusaur" };

      req1.flush(mockPokemon1);
      req2.flush(mockPokemon2);
      req3.flush(mockPokemon3);

      tick();

      // Reset pokemons signal to test cache
      service.pokemons.set([]);

      // Spy on http requests
      spyOn(service["http"], "get").and.callThrough();

      // Call again with same range
      service.loadPokemons(0, 2);

      // Should use cache and not make http requests
      expect(service["http"].get).not.toHaveBeenCalled();

      // Should restore data from cache
      expect(service.pokemons().length).toBe(3);
      expect(service.pokemons()[0].name).toBe("bulbasaur");
    }));

    it("should handle errors when fetching pokemon", fakeAsync(() => {
      // Create spy BEFORE the test runs to ensure it catches all console.error calls
      const consoleSpy = spyOn(console, "error");

      // Call the method
      service.loadPokemons(0, 0);

      // Should be loading
      expect(service.isLoading()).toBeTrue();

      // Get the request
      const req = httpMock.expectOne(`${environment.pokemonURL}/1`);

      // Force an error response
      req.error(new ErrorEvent("Network error"), {
        status: 500,
        statusText: "Server Error",
      });

      // Allow all pending async operations to complete
      tick(1000);

      // Should finish loading
      expect(service.isLoading()).toBeFalse();

      // Make sure the console.error spy was called
      // Note: Since we're checking if it was called with ANY arguments, this should work
      expect(consoleSpy).toHaveBeenCalled();
    }));
  });

  describe("getEvolutionChain", () => {
    it("should correctly parse evolution chain data", () => {
      const result = service.getEvolutionChain(
        mockEvolutionChainResponse.chain,
      );

      expect(result.length).toBe(3);
      expect(result[0].name).toBe("pichu");
      expect(result[0].id).toBe(172);
      expect(result[1].name).toBe("pikachu");
      expect(result[2].name).toBe("raichu");
    });
  });

  describe("isValidRegion", () => {
    it("should return true for valid regions", () => {
      expect(service.isValidRegion("kanto")).toBeTrue();
      expect(service.isValidRegion("johto")).toBeTrue();
    });

    it("should return false for invalid regions", () => {
      expect(service.isValidRegion("invalidRegion")).toBeFalse();
    });
  });

  describe("changeRegion", () => {
    it("should update currentRegion signal and load pokemons for that region", () => {
      // Spy on loadPokemons
      spyOn(service, "loadPokemons");

      // Initial state
      expect(service.currentRegion()).toBe("kanto");

      // Change region
      service.changeRegion("johto");

      // Should update signal
      expect(service.currentRegion()).toBe("johto");

      // Should call loadPokemons with correct range
      expect(service.loadPokemons).toHaveBeenCalledWith(151, 250);
    });
  });

  describe("getPokemonTypeColors", () => {
    it("should return correct color for pokemon type", () => {
      expect(service.getPokemonTypeColors("fire")).toBe("#F08030cc");
      expect(service.getPokemonTypeColors("water")).toBe("#6890F0cc");
    });

    it("should return empty string for invalid type", () => {
      expect(service.getPokemonTypeColors("invalidType")).toBe("");
    });

    it("should return empty string for empty input", () => {
      expect(service.getPokemonTypeColors("")).toBe("");
    });
  });

  describe("currentRegionRange", () => {
    it("should compute current region range based on currentRegion signal", () => {
      // Initial state (kanto)
      expect(service.currentRegionRange().start).toBe(0);
      expect(service.currentRegionRange().end).toBe(150);
      expect(service.currentRegionRange().title).toBe("Kanto Region");

      // Change region
      service.currentRegion.set("johto");

      // Should update computed value
      expect(service.currentRegionRange().start).toBe(151);
      expect(service.currentRegionRange().end).toBe(250);
      expect(service.currentRegionRange().title).toBe("Johto Region");
    });
  });

  describe("getIdFromUrl", () => {
    it("should extract ID from Pokemon URL", () => {
      const url = "https://pokeapi.co/api/v2/pokemon-species/25/";
      const id = (service as any).getIdFromUrl(url);
      expect(id).toBe(25);
    });
  });
});
