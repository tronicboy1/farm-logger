import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NewTreeFormComponent } from "./new-tree-form.component";

describe("NewTreeFormComponent", () => {
  let component: NewTreeFormComponent;
  let fixture: ComponentFixture<NewTreeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewTreeFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTreeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
