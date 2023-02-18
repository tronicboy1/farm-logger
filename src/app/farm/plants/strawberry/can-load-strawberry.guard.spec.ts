import { TestBed } from '@angular/core/testing';

import { CanLoadStrawberryGuard } from './can-load-strawberry.guard';

describe('CanLoadStrawberryGuard', () => {
  let guard: CanLoadStrawberryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanLoadStrawberryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
