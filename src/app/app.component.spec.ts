import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterOutlet } from "@angular/router";
import { AppComponent } from "./app.component";

// Mock HeaderComponent as standalone
@Component({
  selector: "app-header",
  template: "",
  standalone: true,
})
class MockHeaderComponent {}

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockHeaderComponent, RouterOutlet],
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

  // Integration test for ViewChild with DOM interaction
  it("should handle scroll events and update showScrollToTop", () => {
    // Create a mock card container element for the component
    const mockCardContainer = document.createElement("div");
    mockCardContainer.scrollTop = 0;
    component.cardContainer = { nativeElement: mockCardContainer } as any;

    // Initial state should be false
    expect(component.showScrollToTop).toBeFalse();

    // Simulate scrolling
    mockCardContainer.scrollTop = 250;
    component.onScroll();
    expect(component.showScrollToTop).toBeTrue();

    // Simulate scrolling back to top
    mockCardContainer.scrollTop = 50;
    component.onScroll();
    expect(component.showScrollToTop).toBeFalse();
  });
});
