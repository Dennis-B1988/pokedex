import {
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { PokemonService } from "../../../../../core/services/pokemon/pokemon.service";
import { PokemonCardBigComponent } from "../pokemon-card-big/pokemon-card-big.component";

// Stub data
const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  types: [
    { type: { name: "grass", slot: 1 } },
    { type: { name: "poison", slot: 2 } },
  ],
  stats: [],
  sprites: {
    other: {
      "official-artwork": {
        front_default: "",
      },
    },
  },
};

@Component({
  standalone: true,
  selector: "test-host",
  imports: [PokemonCardBigComponent],
  template: `
    <app-pokemon-card-big
      [pokemonId]="1"
      (showPrior)="onPrior()"
      (showNext)="onNext()"
      (closeDetail)="onClose()"
    ></app-pokemon-card-big>
  `,
})
class TestHostComponent {
  onPrior = jasmine.createSpy();
  onNext = jasmine.createSpy();
  onClose = jasmine.createSpy();
}

describe("PokemonCardBigComponent", () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: PokemonCardBigComponent;
  let cardDebug: DebugElement;
  let mockElement: HTMLElement;

  // Create your mockElement here
  beforeEach(() => {
    // Initialize the mockElement and spy on methods inside beforeEach
    mockElement = document.createElement("div");
    mockElement.classList.add("detailed-pokemon-card-container");
    mockElement.setAttribute("tabindex", "-1");

    // Spy on the methods
    spyOn(mockElement, "focus");
    spyOn(mockElement, "addEventListener");
    spyOn(mockElement, "setAttribute");

    // Create a mock ElementRef with querySelector returning the mockElement
    const mockElementRef = {
      nativeElement: {
        querySelector: () => mockElement,
      },
    };

    // Configure the TestBed
    TestBed.configureTestingModule({
      providers: [
        {
          provide: PokemonService,
          useValue: {
            fetchPokemon: jasmine.createSpy().and.returnValue(of(mockPokemon)),
            fetchPokemonSpecies: jasmine
              .createSpy()
              .and.returnValue(of({ evolution_chain: { url: "evo/url" } })),
            fetchEvolutionChain: jasmine
              .createSpy()
              .and.returnValue(of({ chain: {} })),
            getEvolutionChain: jasmine.createSpy().and.returnValue([]),
            getPokemonTypeColors: jasmine
              .createSpy()
              .and.callFake((type: string) => `#123456`),
          },
        },
        {
          provide: ElementRef,
          useValue: mockElementRef, // Inject the mock ElementRef
        },
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    cardDebug = fixture.debugElement.query(
      By.directive(PokemonCardBigComponent),
    );
    component = cardDebug.componentInstance;
  });

  it("should set focus on container after view init", fakeAsync(() => {
    component.ngAfterViewInit();
    tick(); // handle setTimeout(0)
    expect(mockElement.focus).toHaveBeenCalled();
  }));

  it("should emit showPrior on ArrowLeft key press", () => {
    const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    spyOn(component.showPrior, "emit");

    component.handleKeyDown(event);
    expect(component.showPrior.emit).toHaveBeenCalled();
  });

  it("should emit showNext on ArrowRight key press", () => {
    const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
    spyOn(component.showNext, "emit");

    component.handleKeyDown(event);
    expect(component.showNext.emit).toHaveBeenCalled();
  });

  it("should emit closeDetail on Escape key press", () => {
    const event = new KeyboardEvent("keydown", { key: "Escape" });
    spyOn(component.closeDetail, "emit");

    component.handleKeyDown(event);
    expect(component.closeDetail.emit).toHaveBeenCalled();
  });

  it("should return focus on destroy", () => {
    const returnFocusEl = document.createElement("button");
    document.body.appendChild(returnFocusEl);
    returnFocusEl.focus();
    component["previouslyFocusedElement"] = returnFocusEl;

    const focusSpy = spyOn(returnFocusEl, "focus");
    component.ngOnDestroy();
    expect(focusSpy).toHaveBeenCalled();
  });
});
