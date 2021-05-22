import { TestBed } from '@angular/core/testing';

import { GestionMousePickerService } from './gestion-mouse-picker.service';

describe('GestionMousePickerService', () => {
  let service: GestionMousePickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionMousePickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
