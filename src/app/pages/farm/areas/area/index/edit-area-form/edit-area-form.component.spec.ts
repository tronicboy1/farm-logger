import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAreaFormComponent } from './edit-area-form.component';

describe('EditAreaFormComponent', () => {
  let component: EditAreaFormComponent;
  let fixture: ComponentFixture<EditAreaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAreaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAreaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
