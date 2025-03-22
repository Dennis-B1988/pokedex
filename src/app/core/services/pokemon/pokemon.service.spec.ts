// import { TestBed } from '@angular/core/testing';

// import { PokemonService } from './pokemon.service';

// describe('PokemonService', () => {
//   let service: PokemonService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(PokemonService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { DestroyRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../../environment/environment";
import { RegionKey } from "../../models/pokemon-details.model";
import { PokemonService } from "./pokemon.service";

describe("PokemonService", () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PokemonService,
        { provide: DestroyRef, useValue: { onDestroy: () => {} } }, // mock destroy ref
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

  describe("#fetchPokemon", () => {
    it("should fetch pokemon by ID", () => {
      const mockPokemon = { name: "pikachu", id: 25 } as any;

      service.fetchPokemon(25).subscribe((res) => {
        expect(res).toEqual(mockPokemon);
      });

      const req = httpMock.expectOne(`${environment.pokemonURL}/25`);
      expect(req.request.method).toBe("GET");
      req.flush(mockPokemon);
    });
  });

  describe("#loadPokemons", () => {
    it("should fetch and cache pokemon in a range", () => {
      const mockPokemons = Array.from({ length: 2 }, (_, i) => ({
        id: i + 1,
        name: `pokemon${i + 1}`,
      }));

      service.loadPokemons(0, 1); // Will fetch ID 1 and 2

      const reqs = httpMock.match((req) =>
        req.url.startsWith(environment.pokemonURL),
      );

      expect(reqs.length).toBe(2);
      reqs.forEach((req, i) => {
        expect(req.request.method).toBe("GET");
        req.flush(mockPokemons[i]);
      });

      // Check signals updated
      expect(service.isLoading()).toBeFalse();
      expect(service.pokemons().length).toBe(2);
    });

    it("should use cache if available", () => {
      const cached = [{ id: 1, name: "cached" } as any];
      const key = "0-0";

      // Manually populate cache
      (service as any).pokemonCache[key] = cached;

      service.loadPokemons(0, 0);
      expect(service.pokemons()).toEqual(cached);
    });
  });

  describe("#changeRegion", () => {
    it("should change region and load pokemons", () => {
      spyOn(service, "loadPokemons").and.callThrough();

      const mockRegion: RegionKey = "johto";
      service.changeRegion(mockRegion);

      expect(service.currentRegion()).toBe(mockRegion);
      expect(service.loadPokemons).toHaveBeenCalledWith(151, 250);
    });
  });

  describe("#getEvolutionChain", () => {
    it("should return flattened evolution chain", () => {
      const mockChain = {
        species: {
          name: "bulbasaur",
          url: "https://pokeapi.co/api/v2/pokemon/1/",
        },
        evolves_to: [
          {
            species: {
              name: "ivysaur",
              url: "https://pokeapi.co/api/v2/pokemon/2/",
            },
            evolves_to: [
              {
                species: {
                  name: "venusaur",
                  url: "https://pokeapi.co/api/v2/pokemon/3/",
                },
                evolves_to: [],
              },
            ],
          },
        ],
      };

      const result = service.getEvolutionChain(mockChain);

      expect(result).toEqual([
        {
          name: "bulbasaur",
          id: 1,
          image: `${environment.pokemonImageURL}/1.png`,
        },
        {
          name: "ivysaur",
          id: 2,
          image: `${environment.pokemonImageURL}/2.png`,
        },
        {
          name: "venusaur",
          id: 3,
          image: `${environment.pokemonImageURL}/3.png`,
        },
      ]);
    });
  });

  describe("#getPokemonTypeColors", () => {
    it("should return color for a valid type", () => {
      const color = service.getPokemonTypeColors("fire");
      expect(color.startsWith("#")).toBeTrue();
    });

    it("should return empty string for invalid type", () => {
      const color = service.getPokemonTypeColors("invalidType");
      expect(color).toBe("");
    });
  });

  describe("#isValidRegion", () => {
    it("should validate correct region", () => {
      expect(service.isValidRegion("kanto")).toBeTrue();
    });

    it("should invalidate incorrect region", () => {
      expect(service.isValidRegion("nonregion")).toBeFalse();
    });
  });
});
