import { ElementRef, Renderer2, signal } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { MatTooltip } from "@angular/material/tooltip";
import { By } from "@angular/platform-browser";
import { of, throwError } from "rxjs";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { LoadingSpinnerComponent } from "../../loading-spinner/loading-spinner.component";
import { PokemonCardBigComponent } from "./pokemon-card-big.component";

describe("PokemonCardBigComponent", () => {
  let component: PokemonCardBigComponent;
  let fixture: ComponentFixture<PokemonCardBigComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;
  let renderer: jasmine.SpyObj<Renderer2>;

  const mockPokemon: Pokemon = {
    id: 1,
    name: "bulbasaur",
    types: [
      { type: { name: "grass", slot: 1 } },
      { type: { name: "poison", slot: 2 } },
    ],
    stats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "attack" } },
      { base_stat: 49, stat: { name: "defense" } },
      { base_stat: 65, stat: { name: "special-attack" } },
      { base_stat: 65, stat: { name: "special-defense" } },
      { base_stat: 45, stat: { name: "speed" } },
    ],
    sprites: {
      other: {
        "official-artwork": {
          front_default: "https://example.com/bulbasaur.png",
        },
      },
    },
  };

  const mockSpecies = {
    evolution_chain: {
      url: "https://pokeapi.co/api/v2/evolution-chain/1/",
    },
  };

  const mockEvolutionChain = {
    chain: {
      species: {
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon-species/1/",
      },
      evolves_to: [
        {
          species: {
            name: "ivysaur",
            url: "https://pokeapi.co/api/v2/pokemon-species/2/",
          },
          evolves_to: [
            {
              species: {
                name: "venusaur",
                url: "https://pokeapi.co/api/v2/pokemon-species/3/",
              },
              evolves_to: [],
            },
          ],
        },
      ],
    },
  };

  const mockEvolutions = [
    { name: "bulbasaur", id: 1 },
    { name: "ivysaur", id: 2 },
    { name: "venusaur", id: 3 },
  ];

  beforeEach(async () => {
    const pokemonServiceSpy = jasmine.createSpyObj("PokemonService", [
      "fetchPokemon",
      "fetchPokemonSpecies",
      "fetchEvolutionChain",
      "getEvolutionChain",
      "getPokemonTypeColors",
    ]);

    const rendererSpy = jasmine.createSpyObj("Renderer2", [
      "listen",
      "setAttribute",
    ]);

    await TestBed.configureTestingModule({
      imports: [PokemonCardBigComponent, LoadingSpinnerComponent, MatTooltip],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceSpy },
        { provide: Renderer2, useValue: rendererSpy },
      ],
    }).compileComponents();

    pokemonService = TestBed.inject(
      PokemonService,
    ) as jasmine.SpyObj<PokemonService>;
    renderer = TestBed.inject(Renderer2) as jasmine.SpyObj<Renderer2>;

    // Setup default responses for service methods
    pokemonService.fetchPokemon.and.returnValue(of(mockPokemon));
    pokemonService.fetchPokemonSpecies.and.returnValue(of(mockSpecies));
    pokemonService.fetchEvolutionChain.and.returnValue(of(mockEvolutionChain));
    pokemonService.getEvolutionChain.and.returnValue(mockEvolutions);
    pokemonService.getPokemonTypeColors.and.returnValue("#78C850"); // grass color

    // Setup renderer mock
    renderer.listen.and.returnValue(() => {});

    fixture = TestBed.createComponent(PokemonCardBigComponent);
    component = fixture.componentInstance;

    // Set the required input signal
    (component as any).pokemonId = signal(1);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load Pokemon details on initialization", fakeAsync(() => {
    // Arrange - setup already done in beforeEach

    // Act
    fixture.detectChanges(); // Triggers ngOnInit
    tick(); // Process any pending microtasks

    // Assert
    expect(pokemonService.fetchPokemon).toHaveBeenCalledWith(1);
    expect(pokemonService.fetchPokemonSpecies).toHaveBeenCalledWith(1);
    expect(pokemonService.fetchEvolutionChain).toHaveBeenCalledWith(
      mockSpecies.evolution_chain.url,
    );
    expect(component.pokemon).toEqual(mockPokemon);
    expect(component.evolutionChain).toEqual(mockEvolutions);
    expect(component.isLoading).toBeFalse();
  }));

  it("should handle error when loading Pokemon details", fakeAsync(() => {
    // Arrange
    pokemonService.fetchPokemon.and.returnValue(
      throwError(() => new Error("Network error")),
    );

    // Act
    fixture.detectChanges();
    tick();

    // Assert
    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  }));

  it("should get correct Pokemon type color", () => {
    // Arrange
    fixture.detectChanges();

    // Act
    const color = component.getPokemonTypeColor("grass");

    // Assert
    expect(pokemonService.getPokemonTypeColors).toHaveBeenCalledWith("grass");
    expect(color).toBe("#78C850");
  });

  it("should return default color when no type is provided", () => {
    // Act
    const color = component.getPokemonTypeColor();

    // Assert
    expect(color).toBe("#000000");
  });

  it("should format Pokemon name correctly", () => {
    // Act
    const formattedName = component.getPokemonName("charizard-mega-x");

    // Assert
    expect(formattedName).toBe("Charizard-Mega-X");
  });

  it("should get short stat names correctly", () => {
    // Act & Assert
    expect(component.getShortStatName("hp")).toBe("HP");
    expect(component.getShortStatName("attack")).toBe("ATK");
    expect(component.getShortStatName("special-attack")).toBe("S-ATK");
    expect(component.getShortStatName("unknown-stat")).toBe("unknown-stat");
  });

  it("should emit closeDetail when overlay is clicked", () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component.closeDetail, "emit");
    const event = new MouseEvent("click");
    Object.defineProperty(event, "target", {
      value: document.createElement("div"),
    });

    // Act
    component.handleOverlayClick(event);

    // Assert
    expect(component.closeDetail.emit).toHaveBeenCalled();
  });

  it("should not emit closeDetail when clicking inside the card", () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component.closeDetail, "emit");

    // Create a mock event with a target that has a closest method returning a non-null value
    const mockElement = document.createElement("div");
    const event = {
      target: {
        closest: (selector: string) => mockElement,
      },
    } as unknown as MouseEvent;

    // Act
    component.handleKeyDown = jasmine.createSpy("handleKeyDown");
    component.handleOverlayClick(event);

    // Assert
    expect(component.closeDetail.emit).not.toHaveBeenCalled();
  });

  it("should handle Escape key correctly", () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component.closeDetail, "emit");
    const event = new KeyboardEvent("keydown", { key: "Escape" });

    // Act
    component.handleKeyDown(event);

    // Assert
    expect(component.closeDetail.emit).toHaveBeenCalled();
  });

  it("should handle ArrowLeft key correctly", () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component.showPrior, "emit");
    const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    spyOn(event, "preventDefault");

    // Act
    component.handleKeyDown(event);

    // Assert
    expect(component.showPrior.emit).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should handle ArrowRight key correctly", () => {
    // Arrange
    fixture.detectChanges();
    spyOn(component.showNext, "emit");
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    spyOn(event, "preventDefault");

    // Act
    component.handleKeyDown(event);

    // Assert
    expect(component.showNext.emit).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should set up container in ngAfterViewInit", () => {
    // Create a simplified mock
    const mockContainer = jasmine.createSpyObj("HTMLElement", ["focus"]);
    const mockElementRef = {
      nativeElement: {
        querySelector: jasmine
          .createSpy("querySelector")
          .and.returnValue(mockContainer),
        querySelectorAll: jasmine
          .createSpy("querySelectorAll")
          .and.returnValue([]),
      },
    };

    // Replace the component's ElementRef with our mock
    (component as any).elementRef = mockElementRef;

    // Call ngAfterViewInit directly
    component.ngAfterViewInit();

    // Verify querySelector was called with the right selector
    expect(mockElementRef.nativeElement.querySelector).toHaveBeenCalledWith(
      ".detailed-pokemon-card-container",
    );

    // Verify renderer.setAttribute was called correctly
    expect(renderer.setAttribute).toHaveBeenCalledWith(
      mockContainer,
      "tabindex",
      "-1",
    );

    // Check that focus is called (via setTimeout)
    jasmine.clock().install();
    jasmine.clock().tick(10);
    expect(mockContainer.focus).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  // Test keyboard event handling directly through public methods
  // Test keyboard event handling directly through public methods
  it("should handle keyboard navigation correctly", () => {
    // Setup spies on the output events
    const closeDetailSpy = spyOn(component.closeDetail, "emit");
    const showPriorSpy = spyOn(component.showPrior, "emit");
    const showNextSpy = spyOn(component.showNext, "emit");

    // Test Escape key
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    component.handleKeyDown(escapeEvent);
    expect(closeDetailSpy).toHaveBeenCalled();

    // Test ArrowLeft key
    const leftEvent = {
      key: "ArrowLeft",
      preventDefault: jasmine.createSpy("preventDefault"),
    };
    component.handleKeyDown(leftEvent as unknown as KeyboardEvent);
    expect(showPriorSpy).toHaveBeenCalled();
    expect(leftEvent.preventDefault).toHaveBeenCalled();

    // Test ArrowRight key
    const rightEvent = {
      key: "ArrowRight",
      preventDefault: jasmine.createSpy("preventDefault"),
    };
    component.handleKeyDown(rightEvent as unknown as KeyboardEvent);
    expect(showNextSpy).toHaveBeenCalled();
    expect(rightEvent.preventDefault).toHaveBeenCalled();
  });

  // Test for overlay click handling
  it("should handle overlay clicks correctly", () => {
    // Setup spy for the output event
    const closeDetailSpy = spyOn(component.closeDetail, "emit");

    // Test clicking outside the card
    const mockEvent = {
      target: {
        closest: (selector: string) => null,
      },
    };
    component.handleOverlayClick(mockEvent as unknown as MouseEvent);
    expect(closeDetailSpy).toHaveBeenCalled();

    // Test clicking inside the card
    const mockEventInside = {
      target: {
        closest: (selector: string) => document.createElement("div"),
      },
    };
    // Reset the spy manually since we're using the same spy instance
    closeDetailSpy.calls.reset();
    component.handleOverlayClick(mockEventInside as unknown as MouseEvent);
    expect(closeDetailSpy).not.toHaveBeenCalled();
  });

  // Since we can't easily test the Tab key trap behavior in isolation,
  // let's test that the renderer.listen is called with the right parameters
  it("should set up keyboard event listener", () => {
    // Create a simplified mock
    const mockElement = document.createElement("div");
    const mockFocusable = [
      document.createElement("button"),
      document.createElement("button"),
    ];

    const mockElementRef = {
      nativeElement: {
        querySelector: () => mockElement,
        querySelectorAll: () => mockFocusable,
      },
    };

    // Replace the component's ElementRef with our mock
    (component as any).elementRef = mockElementRef;

    // Reset the renderer spy
    renderer.listen.calls.reset();

    // Call the method directly (making it protected helped with this)
    (component as any).setupFocusTrap();

    // Verify renderer.listen was called with the right parameters
    expect(renderer.listen).toHaveBeenCalledWith(
      mockElement,
      "keydown",
      jasmine.any(Function),
    );
  });
});
