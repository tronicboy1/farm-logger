import { TestBed } from "@angular/core/testing";

import { EnvironmentRecordService } from "./environment-record.service";

describe("EnvironmentRecordService", () => {
  let service: EnvironmentRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentRecordService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
