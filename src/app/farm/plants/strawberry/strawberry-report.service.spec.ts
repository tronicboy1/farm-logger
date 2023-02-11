import { TestBed } from '@angular/core/testing';

import { StrawberryReportService } from './strawberry-report.service';

describe('StrawberryReportService', () => {
  let service: StrawberryReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrawberryReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
