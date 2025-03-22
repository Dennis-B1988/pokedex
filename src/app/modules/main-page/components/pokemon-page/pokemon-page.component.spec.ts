import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { Pokemon } from "../../../../core/models/pokemon-details.model";
import { PokemonSearchService } from "../../../../core/services/pokemon-search/pokemon-search.service";
import { PokemonService } from "../../../../core/services/pokemon/pokemon.service";
import { PokemonCardBigComponent } from "./pokemon-card-big/pokemon-card-big.component";
import { PokemonCardsComponent } from "./pokemon-cards/pokemon-cards.component";
import { PokemonPageComponent } from "./pokemon-page.component";

type RegionKey =
  | "kanto"
  | "johto"
  | "hoenn"
  | "sinnoh"
  | "unova"
  | "kalos"
  | "alola"
  | "galar";

describe("PokemonPageComponent", () => {
  let component: PokemonPageComponent;
  let fixture: ComponentFixture<PokemonPageComponent>;
  let pokemonServiceMock: jasmine.SpyObj<PokemonService>;
  let pokemonSearchServiceMock: jasmine.SpyObj<PokemonSearchService>;
  let activatedRouteMock: any;

  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: "Bulbasaur",
      types: [
        { type: { name: "grass", slot: 1 } },
        { type: { name: "poison", slot: 2 } },
      ],
      stats: [
        { base_stat: 45, stat: { name: "hp" } },
        { base_stat: 49, stat: { name: "attack" } },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/bulbasaur.png",
          },
        },
      },
    },
    {
      id: 2,
      name: "Ivysaur",
      types: [
        { type: { name: "grass", slot: 1 } },
        { type: { name: "poison", slot: 2 } },
      ],
      stats: [
        { base_stat: 60, stat: { name: "hp" } },
        { base_stat: 62, stat: { name: "attack" } },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/ivysaur.png",
          },
        },
      },
    },
    {
      id: 3,
      name: "Venusaur",
      types: [
        { type: { name: "grass", slot: 1 } },
        { type: { name: "poison", slot: 2 } },
      ],
      stats: [
        { base_stat: 80, stat: { name: "hp" } },
        { base_stat: 82, stat: { name: "attack" } },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/venusaur.png",
          },
        },
      },
    },
    {
      id: 151,
      name: "Mew",
      types: [{ type: { name: "psychic", slot: 1 } }],
      stats: [
        { base_stat: 100, stat: { name: "hp" } },
        { base_stat: 100, stat: { name: "attack" } },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/mew.png",
          },
        },
      },
    },
    {
      id: 152,
      name: "Chikorita",
      types: [{ type: { name: "grass", slot: 1 } }],
      stats: [
        { base_stat: 45, stat: { name: "hp" } },
        { base_stat: 49, stat: { name: "attack" } },
      ],
      sprites: {
        other: {
          "official-artwork": {
            front_default: "https://example.com/chikorita.png",
          },
        },
      },
    },
  ];

  const mockRegionRanges = {
    kanto: { start: 0, end: 150, title: "Kanto Region" },
    johto: { start: 151, end: 250, title: "Johto Region" },
    hoenn: { start: 251, end: 385, title: "Hoenn Region" },
    sinnoh: { start: 386, end: 492, title: "Sinnoh Region" },
    unova: { start: 493, end: 648, title: "Unova Region" },
    kalos: { start: 649, end: 720, title: "Kalos Region" },
    alola: { start: 721, end: 808, title: "Alola Region" },
    galar: { start: 809, end: 897, title: "Galar Region" },
  };

  // Mock type colors mapping
  const mockTypeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  beforeEach(async () => {
    // Create mock services with signal properties and methods
    pokemonServiceMock = jasmine.createSpyObj(
      "PokemonService",
      ["changeRegion", "isValidRegion", "getPokemonTypeColors"],
      {
        pokemons: signal<Pokemon[]>(mockPokemons),
        currentRegion: signal<RegionKey>("kanto"),
        sort: signal<string>("ID"),
        regionRanges: mockRegionRanges,
      },
    );

    // Mock the getPokemonTypeColors method
    pokemonServiceMock.getPokemonTypeColors.and.callFake((type: string) => {
      return mockTypeColors[type as keyof typeof mockTypeColors] || "#777777";
    });

    pokemonSearchServiceMock = jasmine.createSpyObj(
      "PokemonSearchService",
      [],
      {
        pokemonList: signal<Pokemon[]>([]),
        searchTerm: signal<string>(""),
      },
    );

    // Create a mock for ActivatedRoute with params observable
    activatedRouteMock = {
      params: of({ region: "kanto" }),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PokemonPageComponent,
        PokemonCardsComponent,
        PokemonCardBigComponent,
      ],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceMock },
        { provide: PokemonSearchService, useValue: pokemonSearchServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("should change region to kanto on init with valid region parameter", () => {
      expect(pokemonServiceMock.isValidRegion).toHaveBeenCalledWith("kanto");
      expect(pokemonServiceMock.changeRegion).toHaveBeenCalledWith("kanto");
    });

    it("should change region to kanto when an invalid region is provided", () => {
      // Reset spies
      pokemonServiceMock.isValidRegion.calls.reset();
      pokemonServiceMock.changeRegion.calls.reset();

      // Setup invalid region route parameter
      const invalidRoute = { params: of({ region: "invalid" }) };
      pokemonServiceMock.isValidRegion.and.returnValue(false);

      TestBed.resetTestingModule().configureTestingModule({
        imports: [RouterTestingModule, PokemonPageComponent],
        providers: [
          { provide: PokemonService, useValue: pokemonServiceMock },
          { provide: PokemonSearchService, useValue: pokemonSearchServiceMock },
          { provide: ActivatedRoute, useValue: invalidRoute },
        ],
      });

      const newFixture = TestBed.createComponent(PokemonPageComponent);
      newFixture.detectChanges();

      expect(pokemonServiceMock.isValidRegion).toHaveBeenCalledWith("invalid");
      expect(pokemonServiceMock.changeRegion).toHaveBeenCalledWith("kanto");
    });
  });

  describe("getPokemonTypeColors", () => {
    it("should return the correct color for a given type", () => {
      expect(pokemonServiceMock.getPokemonTypeColors("grass")).toEqual(
        "#7AC74C",
      );
      expect(pokemonServiceMock.getPokemonTypeColors("fire")).toEqual(
        "#EE8130",
      );
      expect(pokemonServiceMock.getPokemonTypeColors("water")).toEqual(
        "#6390F0",
      );
    });

    it("should return a default color for unknown types", () => {
      expect(pokemonServiceMock.getPokemonTypeColors("unknown")).toEqual(
        "#777777",
      );
    });
  });

  describe("sortedPokemons", () => {
    it("should return pokemons sorted by ID when sort is ID", () => {
      // Ensure sort is set to ID
      pokemonServiceMock.sort.set("ID");
      fixture.detectChanges();

      const sorted = component.sortedPokemons;
      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3);
    });

    it("should return pokemons sorted by name when sort is Name", () => {
      // Set some test data with names in non-alphabetical order
      const nameSortTestData: Pokemon[] = [
        {
          id: 1,
          name: "Bulbasaur",
          types: [{ type: { name: "grass", slot: 1 } }],
          stats: [{ base_stat: 45, stat: { name: "hp" } }],
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
          },
        },
        {
          id: 3,
          name: "Venusaur",
          types: [{ type: { name: "grass", slot: 1 } }],
          stats: [{ base_stat: 80, stat: { name: "hp" } }],
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/venusaur.png",
              },
            },
          },
        },
        {
          id: 2,
          name: "Ivysaur",
          types: [{ type: { name: "grass", slot: 1 } }],
          stats: [{ base_stat: 60, stat: { name: "hp" } }],
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/ivysaur.png",
              },
            },
          },
        },
      ];
      pokemonServiceMock.pokemons.set(nameSortTestData);

      // Change the sort to Name
      pokemonServiceMock.sort.set("Name");
      fixture.detectChanges();

      const sorted = component.sortedPokemons;
      expect(sorted[0].name).toBe("Bulbasaur");
      expect(sorted[1].name).toBe("Ivysaur");
      expect(sorted[2].name).toBe("Venusaur");
    });
  });

  describe("showPokemonDetails", () => {
    it("should set selectedPokemonId to the provided id", () => {
      component.showPokemonDetails(5);
      expect(component.selectedPokemonId()).toBe(5);
    });
  });

  describe("closeDetails", () => {
    it("should set selectedPokemonId to null", () => {
      // First set a value
      component.showPokemonDetails(5);
      expect(component.selectedPokemonId()).toBe(5);

      // Then close details
      component.closeDetails();
      expect(component.selectedPokemonId()).toBeNull();
    });
  });

  describe("showPriorPokemonDetails", () => {
    beforeEach(() => {
      // Set current region to kanto for these tests
      pokemonServiceMock.currentRegion.set("kanto");
    });

    it("should set selectedPokemonId to the previous Pokemon ID", () => {
      component.showPokemonDetails(5);
      component.showPriorPokemonDetails();
      expect(component.selectedPokemonId()).toBe(4);
    });

    it("should wrap to the last Pokemon of the region if at the first Pokemon", () => {
      // First Pokemon in Kanto is ID 1 (start + 1)
      component.showPokemonDetails(1);
      component.showPriorPokemonDetails();
      // Should wrap to the last Pokemon (end + 1)
      expect(component.selectedPokemonId()).toBe(151);
    });

    it("should do nothing if no Pokemon is selected", () => {
      component.selectedPokemonId.set(null);
      component.showPriorPokemonDetails();
      expect(component.selectedPokemonId()).toBeNull();
    });
  });

  describe("showNextPokemonDetails", () => {
    beforeEach(() => {
      // Set current region to kanto for these tests
      pokemonServiceMock.currentRegion.set("kanto");
    });

    it("should set selectedPokemonId to the next Pokemon ID", () => {
      component.showPokemonDetails(5);
      component.showNextPokemonDetails();
      expect(component.selectedPokemonId()).toBe(6);
    });

    it("should wrap to the first Pokemon of the region if at the last Pokemon", () => {
      // Last Pokemon in Kanto is ID 151 (end + 1)
      component.showPokemonDetails(151);
      component.showNextPokemonDetails();
      // Should wrap to the first Pokemon (start + 1)
      expect(component.selectedPokemonId()).toBe(1);
    });

    it("should do nothing if no Pokemon is selected", () => {
      component.selectedPokemonId.set(null);
      component.showNextPokemonDetails();
      expect(component.selectedPokemonId()).toBeNull();
    });
  });

  describe("region changes", () => {
    it("should update currentRegion when a valid region is provided", () => {
      // Create a new route with a different region
      const johtoRoute = { params: of({ region: "johto" }) };
      pokemonServiceMock.isValidRegion.and.returnValue(true);

      TestBed.resetTestingModule().configureTestingModule({
        imports: [RouterTestingModule, PokemonPageComponent],
        providers: [
          { provide: PokemonService, useValue: pokemonServiceMock },
          { provide: PokemonSearchService, useValue: pokemonSearchServiceMock },
          { provide: ActivatedRoute, useValue: johtoRoute },
        ],
      });

      const newFixture = TestBed.createComponent(PokemonPageComponent);
      newFixture.detectChanges();

      expect(pokemonServiceMock.isValidRegion).toHaveBeenCalledWith("johto");
      expect(pokemonServiceMock.changeRegion).toHaveBeenCalledWith("johto");
    });
  });
});
