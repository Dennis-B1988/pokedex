import { signal, WritableSignal } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { MatSelectChange } from "@angular/material/select";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RegionKey } from "../../core/models/pokemon-details.model";
import { PokemonSearchService } from "../../core/services/pokemon-search/pokemon-search.service";
import { PokemonService } from "../../core/services/pokemon/pokemon.service";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockPokemonService: jasmine.SpyObj<PokemonService>;
  let mockPokemonSearchService: jasmine.SpyObj<PokemonSearchService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRegionSignal: WritableSignal<RegionKey>;
  let mockSortSignal: WritableSignal<string>;

  beforeEach(async () => {
    // Create writeable signals that we'll spy on later
    mockRegionSignal = signal<RegionKey>("kanto");
    mockSortSignal = signal<string>("ID");

    // Create spy objects for the services and router
    mockPokemonService = jasmine.createSpyObj("PokemonService", [], {
      isLoading: signal(false),
      sort: mockSortSignal,
      currentRegion: mockRegionSignal,
      regionRanges: {
        kanto: { start: 0, end: 150, title: "Kanto Region" },
        johto: { start: 151, end: 250, title: "Johto Region" },
        hoenn: { start: 251, end: 385, title: "Hoenn Region" },
        sinnoh: { start: 386, end: 492, title: "Sinnoh Region" },
        unova: { start: 493, end: 648, title: "Unova Region" },
        kalos: { start: 649, end: 720, title: "Kalos Region" },
        alola: { start: 721, end: 808, title: "Alola Region" },
        galar: { start: 809, end: 897, title: "Galar Region" },
      },
    });

    mockPokemonSearchService = jasmine.createSpyObj(
      "PokemonSearchService",
      ["searchPokemon"],
      {
        searchTerm: signal(""),
      },
    );

    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
        { provide: PokemonSearchService, useValue: mockPokemonSearchService },
        { provide: Router, useValue: mockRouter },
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with correct data", () => {
    expect(component.searchTerm).toBe(mockPokemonSearchService.searchTerm);
    expect(component.isLoading).toBe(mockPokemonService.isLoading);
    expect(component.menuOpen).toBeFalse();
    expect(component.windowWidth).toBeGreaterThan(0);
    expect(component.sort).toBe(mockPokemonService.sort);
    expect(component.currentRegion).toBe(mockPokemonService.currentRegion);
  });

  it("should map regions with ranges correctly", () => {
    expect(component.regionsWithRange.length).toBe(8);
    expect(component.regionsWithRange[0].name).toBe("kanto");
    expect(component.regionsWithRange[0].start).toBe(1);
    expect(component.regionsWithRange[0].end).toBe(151);

    expect(component.regionsWithRange[1].name).toBe("johto");
    expect(component.regionsWithRange[1].start).toBe(152);
    expect(component.regionsWithRange[1].end).toBe(251);
  });

  it("should update windowWidth on resize", () => {
    const newWidth = 500;
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      value: newWidth,
      configurable: true,
    });

    component.updateWindowWidth();

    expect(component.windowWidth).toBe(newWidth);

    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      configurable: true,
    });
  });

  it("should select region and navigate to it", () => {
    const regionKey: RegionKey = "johto";
    const announceSpy = spyOn<any>(component, "announceChange");

    // Spy on the signal's set method
    const regionSetSpy = spyOn(mockRegionSignal, "set");

    component.selectRegion(regionKey);

    expect(regionSetSpy).toHaveBeenCalledWith(regionKey);
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/region", regionKey]);
    expect(announceSpy).toHaveBeenCalledWith(`Region changed to ${regionKey}`);
  });

  it("should search for pokemon", () => {
    const searchText = "pikachu";
    const event = { target: { value: searchText } } as unknown as Event;

    component.searchPokemon(event);

    expect(mockPokemonSearchService.searchPokemon).toHaveBeenCalledWith(
      searchText,
    );
  });

  it("should sort pokemon", () => {
    const sortMethod = "Name";
    const mockEvent = { value: sortMethod } as MatSelectChange;
    const announceSpy = spyOn<any>(component, "announceChange");

    // Spy on the signal's set method
    const sortSetSpy = spyOn(mockSortSignal, "set");

    component.sortPokemon(mockEvent);

    expect(sortSetSpy).toHaveBeenCalledWith(sortMethod);
    expect(announceSpy).toHaveBeenCalledWith(
      `Pokémon list sorted by ${sortMethod}`,
    );
  });

  it("should toggle menu", () => {
    const announceSpy = spyOn<any>(component, "announceChange");
    expect(component.menuOpen).toBeFalse();

    component.toggleMenu();

    expect(component.menuOpen).toBeTrue();
    expect(announceSpy).toHaveBeenCalledWith("Filter menu opened");

    component.toggleMenu();

    expect(component.menuOpen).toBeFalse();
    expect(announceSpy).toHaveBeenCalledWith("Filter menu closed");
  });

  it("should close menu on Escape key", () => {
    component.menuOpen = true;
    const announceSpy = spyOn<any>(component, "announceChange");

    const handleKeyDown = (component as any).handleKeyDown;
    handleKeyDown(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(component.menuOpen).toBeFalse();
    expect(announceSpy).toHaveBeenCalledWith("Filter menu closed");
  });

  it("should not close menu on other keys", () => {
    component.menuOpen = true;
    const announceSpy = spyOn<any>(component, "announceChange");

    const handleKeyDown = (component as any).handleKeyDown;
    handleKeyDown(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(component.menuOpen).toBeTrue();
    expect(announceSpy).not.toHaveBeenCalled();
  });

  it("should announce changes to screen readers", fakeAsync(() => {
    const mockLiveRegion = document.createElement("div");
    mockLiveRegion.setAttribute("aria-live", "polite");
    document.body.appendChild(mockLiveRegion);
    spyOn(document, "querySelector").and.returnValue(mockLiveRegion);

    const testMessage = "Test announcement";
    (component as any).announceChange(testMessage);

    expect(mockLiveRegion.textContent).toBe(testMessage);

    tick(5000);
    expect(mockLiveRegion.textContent).toBe("");

    document.body.removeChild(mockLiveRegion);
  }));

  it("should set up event listeners on init and remove them on destroy", () => {
    const addEventSpy = spyOn(window, "addEventListener");
    const removeEventSpy = spyOn(window, "removeEventListener");

    component.ngOnInit();

    expect(addEventSpy).toHaveBeenCalledWith(
      "resize",
      component.updateWindowWidth,
    );
    expect(addEventSpy).toHaveBeenCalledWith("keydown", jasmine.any(Function));

    component.ngOnDestroy();

    expect(removeEventSpy).toHaveBeenCalledWith(
      "resize",
      component.updateWindowWidth,
    );
    expect(removeEventSpy).toHaveBeenCalledWith(
      "keydown",
      jasmine.any(Function),
    );
  });
});
