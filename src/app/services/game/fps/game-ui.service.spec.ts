import { TestBed } from '@angular/core/testing';

import { GameUIService } from './game-ui.service';

describe('GameUIService', () => {
  let service: GameUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
