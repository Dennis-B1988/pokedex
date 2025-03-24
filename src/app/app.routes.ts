import { Routes } from "@angular/router";
import { MainPageComponent } from "./modules/main-page/main-page.component";

export const routes: Routes = [
  {
    path: "",
    component: MainPageComponent,
    children: [
      {
        path: "",
        redirectTo: "region/kanto",
        pathMatch: "full",
      },
      {
        path: "region/:region",
        loadComponent: () =>
          import(
            "./modules/main-page/components/pokemon-page/pokemon-page.component"
          ).then((m) => m.PokemonPageComponent),
      },
    ],
  },
  {
    path: "Impressum",
    loadComponent: () =>
      import("./modules/main-page/legal-notice/legal-notice.component").then(
        (m) => m.LegalNoticeComponent,
      ),
  },
];
