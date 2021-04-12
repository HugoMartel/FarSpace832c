import { TestBed } from '@angular/core/testing';

import { GamePlayerService } from './game-player.service';

describe('GamePlayerService', () => {
  let service: GamePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
