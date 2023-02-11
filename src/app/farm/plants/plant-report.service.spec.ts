import { TestBed } from '@angular/core/testing';
import { PlantReportService } from './plant-report.service';

describe('TreeReportService', () => {
  let service: PlantReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
