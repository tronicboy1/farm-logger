import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewCropdustFormComponent } from "./new-cropdust-form.component";

describe("NewCropdustFormComponent", () => {
  let component: NewCropdustFormComponent;
  let fixture: ComponentFixture<NewCropdustFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewCropdustFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewCropdustFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
