import { TestBed } from '@angular/core/testing';

import { GameArmorService } from './game-armor.service';

describe('GameArmorService', () => {
  let service: GameArmorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameArmorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
