import { provideHttpClient } from "@angular/common/http";
import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterOutlet } from "@angular/router";
import { AppComponent } from "./app.component";
import { PokemonService } from "./core/services/pokemon/pokemon.service"; // Update with correct path

// Mock HeaderComponent as standalone
@Component({
  selector: "app-header",
  template: "",
  standalone: true,
})
class MockHeaderComponent {}

// Create a mock PokemonService with signals
class MockPokemonService {
  pokemons = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  sort = signal<string>("ID");
  currentRegion = signal<any>("kanto");

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

  currentRegionRange = signal(this.regionRanges["kanto"]);

  loadPokemons() {
    // Mock implementation
  }

  changeRegion() {
    // Mock implementation
  }

  getPokemonTypeColors(color: string): string {
    return "#ff0000cc"; // Mock color return
  }

  fetchPokemon() {
    // Mock implementation
    return { subscribe: () => {} };
  }

  fetchPokemonSpecies() {
    // Mock implementation
    return { subscribe: () => {} };
  }

  fetchEvolutionChain() {
    // Mock implementation
    return { subscribe: () => {} };
  }

  getEvolutionChain() {
    return []; // Mock implementation
  }

  isValidRegion() {
    return true; // Mock implementation
  }
}

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockPokemonService: MockPokemonService;

  beforeEach(async () => {
    mockPokemonService = new MockPokemonService();

    await TestBed.configureTestingModule({
      imports: [AppComponent, MockHeaderComponent, RouterOutlet],
      providers: [
        provideHttpClient(),
        { provide: PokemonService, useValue: mockPokemonService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });

  it("should have the correct title", () => {
    expect(component.title).toEqual("pokédex");
  });

  it("should initialize showScrollToTop as false", () => {
    expect(component.showScrollToTop).toBeFalse();
  });

  describe("onScroll", () => {
    it("should set showScrollToTop to true when scrollTop > 200", () => {
      // Arrange
      component.cardContainer = {
        nativeElement: {
          scrollTop: 250,
        },
      } as any;

      // Act
      component.onScroll();

      // Assert
      expect(component.showScrollToTop).toBeTrue();
    });

    it("should set showScrollToTop to false when scrollTop <= 200", () => {
      // Arrange
      component.cardContainer = {
        nativeElement: {
          scrollTop: 150,
        },
      } as any;
      component.showScrollToTop = true;

      // Act
      component.onScroll();

      // Assert
      expect(component.showScrollToTop).toBeFalse();
    });
  });

  describe("scrollToTop", () => {
    it("should set scrollTop to 0 when cardContainer exists", () => {
      // Arrange
      const mockNativeElement = { scrollTop: 500 };
      component.cardContainer = {
        nativeElement: mockNativeElement,
      } as any;

      // Act
      component.scrollToTop();

      // Assert
      expect(mockNativeElement.scrollTop).toBe(0);
    });

    it("should not throw error when cardContainer is undefined", () => {
      // Arrange
      component.cardContainer = undefined as any;

      // Act & Assert
      expect(() => component.scrollToTop()).not.toThrow();
    });
  });

  it("should handle scroll events and update showScrollToTop", () => {
    // Create a more explicit mock that matches exactly what the component expects
    const mockNativeElement = { scrollTop: 0 };
    component.cardContainer = { nativeElement: mockNativeElement } as any;

    // Verify initial state
    expect(component.showScrollToTop).toBeFalse();

    // Directly modify the scrollTop of our mock
    mockNativeElement.scrollTop = 250;

    // Call onScroll to trigger the check
    component.onScroll();

    // Now verify the flag is updated
    expect(component.showScrollToTop).toBeTrue();

    // Test scrolling back to top
    mockNativeElement.scrollTop = 50;
    component.onScroll();
    expect(component.showScrollToTop).toBeFalse();
  });
});
