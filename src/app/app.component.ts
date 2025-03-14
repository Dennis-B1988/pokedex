import { Component, ElementRef, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./modules/header/header/header.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "pokedex";

  showScrollToTop: boolean = false;

  @ViewChild("cardContainer", { static: false }) cardContainer!: ElementRef;

  onScroll(): void {
    const scrollContainer = this.cardContainer.nativeElement;
    const scrollTop = scrollContainer.scrollTop;
    const shouldLoadMore =
      scrollContainer.scrollTop + scrollContainer.clientHeight >=
      scrollContainer.scrollHeight;

    this.showScrollToTop = scrollTop > 200;

    // if (shouldLoadMore) {
    //   this.loadMorePokemons();
    // }
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
