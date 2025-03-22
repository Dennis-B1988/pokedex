import { Component, ElementRef, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./modules/header/header.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "pokédex";

  showScrollToTop: boolean = false;

  @ViewChild("cardContainer", { static: false }) cardContainer!: ElementRef;

  /**
   * Checks if the scroll position of the Pokemon card container is greater than
   * 200px. If it is, it sets the showScrollToTop property to true, otherwise
   * sets it to false. This is used to show or hide the "Scroll to top" button.
   */
  onScroll(): void {
    const scrollContainer = this.cardContainer.nativeElement;
    const scrollTop = scrollContainer.scrollTop;

    this.showScrollToTop = scrollTop > 200;
  }

  /**
   * Scrolls the Pokemon card container back to the top.
   */
  scrollToTop(): void {
    if (this.cardContainer) {
      this.cardContainer.nativeElement.scrollTop = 0;
    }
  }
}
