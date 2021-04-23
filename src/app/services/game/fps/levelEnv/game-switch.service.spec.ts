import { TestBed } from '@angular/core/testing';

import { GameSwitchService } from './game-switch.service';

describe('GameSwitchService', () => {
  let service: GameSwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
