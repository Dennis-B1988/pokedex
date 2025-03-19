import { TestBed } from '@angular/core/testing';

import { PokemonSearchService } from './pokemon-search.service';

describe('PokemonSearchService', () => {
  let service: PokemonSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
