import { TestBed } from "@angular/core/testing";

import { AuthService } from "./auth.service";
import { UserModule } from "./user.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserModule],
    });
    service = TestBed.inject(AuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
