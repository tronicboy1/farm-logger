import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPlantReportFormComponent } from './new-plant-report-form.component';

describe('NewPlantReportFormComponent', () => {
  let component: NewPlantReportFormComponent;
  let fixture: ComponentFixture<NewPlantReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPlantReportFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPlantReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
