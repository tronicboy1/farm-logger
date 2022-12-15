import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavLocationComponent } from "./nav-location.component";

describe("NavLocationComponent", () => {
  let component: NavLocationComponent;
  let fixture: ComponentFixture<NavLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
