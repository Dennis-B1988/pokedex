import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardsFullComponent } from './pokemon-cards-full.component';

describe('PokemonCardsFullComponent', () => {
  let component: PokemonCardsFullComponent;
  let fixture: ComponentFixture<PokemonCardsFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardsFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCardsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
