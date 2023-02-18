import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStrawberryReportFormComponent } from './new-strawberry-report-form.component';

describe('NewStrawberryReportFormComponent', () => {
  let component: NewStrawberryReportFormComponent;
  let fixture: ComponentFixture<NewStrawberryReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStrawberryReportFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStrawberryReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
