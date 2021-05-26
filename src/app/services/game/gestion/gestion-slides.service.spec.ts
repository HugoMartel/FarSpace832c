import { TestBed } from '@angular/core/testing';

import { GestionSlidesService } from './gestion-slides.service';

describe('GestionSlidesService', () => {
  let service: GestionSlidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionSlidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
