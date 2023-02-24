import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStrawberryReportModalComponent } from './new-strawberry-report-modal.component';

describe('NewStrawberryReportModalComponent', () => {
  let component: NewStrawberryReportModalComponent;
  let fixture: ComponentFixture<NewStrawberryReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStrawberryReportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStrawberryReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
