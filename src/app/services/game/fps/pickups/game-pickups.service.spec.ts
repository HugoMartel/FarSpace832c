import { TestBed } from '@angular/core/testing';

import { GamePickupsService } from './game-pickups.service';

describe('GamePickupsService', () => {
  let service: GamePickupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamePickupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
