import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewFertilizationFormComponent } from "./new-fertilization-form.component";

describe("NewFertilizationFormComponent", () => {
  let component: NewFertilizationFormComponent;
  let fixture: ComponentFixture<NewFertilizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewFertilizationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewFertilizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
