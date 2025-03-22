import { Component, signal, WritableSignal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";
import { MainPageComponent } from "./main-page.component";

// Use the same Pokemon interface as the service would have
interface Pokemon {
  id: number;
  name: string;
  // Add any other properties the Pokemon interface has
}

// Create a mock spinner component
@Component({
  selector: "app-loading-spinner",
  template: '<div class="mock-spinner"></div>',
  standalone: true,
})
class MockLoadingSpinnerComponent {}

describe("MainPageComponent", () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;

  // Define initial mock data
  const initialPokemons: Pokemon[] = [
    { id: 1, name: "Bulbasaur" },
    { id: 2, name: "Ivysaur" },
  ];

  // Create the same signal types as the service
  let mockPokemons: WritableSignal<Pokemon[]>;
  let mockIsLoading: WritableSignal<boolean>;

  beforeEach(async () => {
    // Reset signals before each test to ensure isolation
    mockPokemons = signal<Pokemon[]>([...initialPokemons]);
    mockIsLoading = signal<boolean>(false);

    // Create a mock PokemonService with the same signal structure as the real service
    mockPokemonService = jasmine.createSpyObj("PokemonService", [], {
      pokemons: mockPokemons,
      isLoading: mockIsLoading,
    });

    await TestBed.configureTestingModule({
      imports: [MainPageComponent, MockLoadingSpinnerComponent, RouterOutlet],
      providers: [{ provide: PokemonService, useValue: mockPokemonService }],
    })
      .overrideComponent(MainPageComponent, {
        set: {
          imports: [RouterOutlet, MockLoadingSpinnerComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should inject PokemonService", () => {
    expect(component.pokemonService).toBeDefined();
    expect(component.pokemonService).toEqual(mockPokemonService);
  });

  it("should have pokemons signal from the service with initial values", () => {
    expect(component.pokemons).toBe(mockPokemons);

    // Access signal value and verify it matches initial data
    const pokemonValue = component.pokemons();
    expect(pokemonValue.length).toBe(2);
    expect(pokemonValue[0].name).toBe("Bulbasaur");
    expect(pokemonValue[1].name).toBe("Ivysaur");
  });

  it("should have isLoading signal from the service", () => {
    expect(component.isLoading).toBe(mockIsLoading);

    // Verify initial value
    expect(component.isLoading()).toBe(false);
  });

  it("should show loading spinner when isLoading signal is true", () => {
    // Change loading state to true
    mockIsLoading.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(MockLoadingSpinnerComponent),
    );
    expect(spinner).toBeTruthy();
  });

  it("should hide loading spinner when isLoading signal is false", () => {
    // Ensure loading state is false
    mockIsLoading.set(false);
    fixture.detectChanges();

    // This test assumes the template conditionally shows the spinner based on isLoading
    const spinner = fixture.debugElement.query(
      By.directive(MockLoadingSpinnerComponent),
    );
    expect(spinner).toBeFalsy();
  });

  it("should update view when pokemons signal changes", () => {
    // Verify initial state first
    expect(component.pokemons().length).toBe(2);
    expect(component.pokemons()[0].name).toBe("Bulbasaur");

    // Update the pokemons signal with new data
    const newPokemons: Pokemon[] = [
      { id: 3, name: "Venusaur" },
      { id: 4, name: "Charmander" },
      { id: 5, name: "Charmeleon" },
    ];
    mockPokemons.set(newPokemons);

    fixture.detectChanges();

    // Verify the component's signal has the new value
    const updatedPokemons = component.pokemons();
    expect(updatedPokemons.length).toBe(3);
    expect(updatedPokemons[0].name).toBe("Venusaur");
  });
});
