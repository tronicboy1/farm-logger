import { TestBed } from "@angular/core/testing";

import { MemberGuard } from "./member.guard";

describe("OwnerGuard", () => {
  let guard: MemberGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MemberGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
