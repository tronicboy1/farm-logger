import { TestBed } from "@angular/core/testing";

import { TreeReportService } from "./tree-report.service";

describe("TreeReportService", () => {
  let service: TreeReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeReportService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
