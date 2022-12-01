import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReportFormComponent } from './new-report-form.component';

describe('NewReportFormComponent', () => {
  let component: NewReportFormComponent;
  let fixture: ComponentFixture<NewReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewReportFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
