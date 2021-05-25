import { TestBed } from '@angular/core/testing';

import { GestionHudService } from './gestion-hud.service';

describe('GestionHudService', () => {
  let service: GestionHudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionHudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});