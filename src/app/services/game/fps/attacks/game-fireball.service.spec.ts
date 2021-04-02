import { TestBed } from '@angular/core/testing';

import { GameFireballService } from './game-fireball.service';

describe('GameFireballService', () => {
  let service: GameFireballService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameFireballService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
