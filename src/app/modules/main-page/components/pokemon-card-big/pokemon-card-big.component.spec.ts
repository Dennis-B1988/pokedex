import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardBigComponent } from './pokemon-card-big.component';

describe('PokemonCardBigComponent', () => {
  let component: PokemonCardBigComponent;
  let fixture: ComponentFixture<PokemonCardBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCardBigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCardBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
