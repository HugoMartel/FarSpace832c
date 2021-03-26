import { TestBed } from '@angular/core/testing';

import { GameImpService } from './game-imp.service';

describe('GameImpService', () => {
  let service: GameImpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameImpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
