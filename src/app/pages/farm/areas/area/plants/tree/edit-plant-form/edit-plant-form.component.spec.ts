import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPlantFormComponent } from './edit-plant-form.component';

describe('EditPlantFormComponent', () => {
  let component: EditPlantFormComponent;
  let fixture: ComponentFixture<EditPlantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
