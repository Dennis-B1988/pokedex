import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Pokemon } from "../../../../../core/models/pokemon-details.model";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { PokemonCardsComponent } from "./pokemon-cards.component";

// 🧪 Mock Service
class MockPokemonService {
  getPokemonTypeColors(type: string) {
    return (
      {
        fire: "#F08030",
        water: "#6890F0",
        grass: "#78C850",
      }[type] || "#000000"
    );
  }
}

// 🧪 Minimal test wrapper (to test input binding)
@Component({
  template: `<app-pokemon-cards [pokemon]="mockPokemon"></app-pokemon-cards>`,
  standalone: true,
  imports: [PokemonCardsComponent],
})
class TestHostComponent {
  mockPokemon: Pokemon = {
    name: "charizard",
    types: [{ type: { name: "fire" } }, { type: { name: "flying" } }],
  } as any;
}

describe("PokemonCardsComponent", () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PokemonService, useClass: MockPokemonService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    const cardComponent = fixture.debugElement.query(
      By.directive(PokemonCardsComponent),
    );
    expect(cardComponent).toBeTruthy();
  });

  it("should return correct box shadow for two types", () => {
    const cardInstance = fixture.debugElement.query(
      By.directive(PokemonCardsComponent),
    ).componentInstance;
    const boxShadow = cardInstance.getBoxShadowStyle();
    expect(boxShadow).toContain("#F08030"); // fire
    expect(boxShadow).toContain("#000000"); // flying (not mocked, falls back)
  });

  it("should return correct box shadow for one type", () => {
    const cardComponent = fixture.debugElement.query(
      By.directive(PokemonCardsComponent),
    ).componentInstance;
    cardComponent.pokemon = () =>
      ({
        name: "bulbasaur",
        types: [{ type: { name: "grass" } }],
      }) as any;
    const shadow = cardComponent.getBoxShadowStyle();
    expect(shadow).toBe(`0rem 0rem 0.625rem 0.625rem #78C850`);
  });

  it("should use PokemonService for type color", () => {
    const service = TestBed.inject(PokemonService);
    spyOn(service, "getPokemonTypeColors").and.callThrough();

    const cardComponent = fixture.debugElement.query(
      By.directive(PokemonCardsComponent),
    ).componentInstance;
    cardComponent.pokemon = () =>
      ({
        types: [{ type: { name: "fire" } }],
      }) as any;

    cardComponent.getBoxShadowStyle();

    expect(service.getPokemonTypeColors).toHaveBeenCalledWith("fire");
  });
});
