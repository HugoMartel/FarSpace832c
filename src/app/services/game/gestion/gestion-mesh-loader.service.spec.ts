import { TestBed } from '@angular/core/testing';

import { GestionMeshLoaderService } from './gestion-mesh-loader.service';

describe('GestionMeshLoaderService', () => {
  let service: GestionMeshLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionMeshLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
