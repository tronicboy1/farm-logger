import { TestBed } from '@angular/core/testing';

import { FertilizationService } from './fertilization.service';

describe('FertilizationService', () => {
  let service: FertilizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FertilizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
