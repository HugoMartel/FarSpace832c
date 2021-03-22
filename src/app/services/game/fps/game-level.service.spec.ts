import { TestBed } from '@angular/core/testing';

import { GameLevelService } from './game-level.service';

describe('GameLevelService', () => {
  let service: GameLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
