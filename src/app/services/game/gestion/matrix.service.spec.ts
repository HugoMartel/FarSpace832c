import { TestBed } from '@angular/core/testing';

import { matrixService } from './matrix.service';

describe('matrixService', () => {
  let service: matrixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(matrixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
