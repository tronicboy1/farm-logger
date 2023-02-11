import { TestBed } from '@angular/core/testing';

import { StrawberryService } from './strawberry.service';

describe('StrawberryService', () => {
  let service: StrawberryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrawberryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
