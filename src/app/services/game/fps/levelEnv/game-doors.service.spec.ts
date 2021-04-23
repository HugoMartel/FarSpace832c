import { TestBed } from '@angular/core/testing';

import { GameDoorsService } from './game-doors.service';

describe('GameDoorsService', () => {
  let service: GameDoorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDoorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
