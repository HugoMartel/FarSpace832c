import { TestBed } from '@angular/core/testing';

import { RandomFunctionsService } from './random-functions.service';

describe('RandomFunctionsService', () => {
  let service: RandomFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
