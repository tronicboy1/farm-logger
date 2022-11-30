import { TestBed } from "@angular/core/testing";

import { CropdustService } from "./cropdust.service";

describe("CropdustService", () => {
  let service: CropdustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CropdustService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
