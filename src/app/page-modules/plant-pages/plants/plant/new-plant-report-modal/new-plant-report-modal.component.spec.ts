import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlantReportModalComponent } from './new-plant-report-modal.component';

describe('NewPlantReportModalComponent', () => {
  let component: NewPlantReportModalComponent;
  let fixture: ComponentFixture<NewPlantReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPlantReportModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlantReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
