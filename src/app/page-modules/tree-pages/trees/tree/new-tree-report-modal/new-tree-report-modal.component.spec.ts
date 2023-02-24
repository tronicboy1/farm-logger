import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTreeReportModalComponent } from './new-tree-report-modal.component';

describe('NewTreeReportModalComponent', () => {
  let component: NewTreeReportModalComponent;
  let fixture: ComponentFixture<NewTreeReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTreeReportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTreeReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
