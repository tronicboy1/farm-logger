import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStrawberryFormComponent } from './edit-strawberry-form.component';

describe('EditStrawberryFormComponent', () => {
  let component: EditStrawberryFormComponent;
  let fixture: ComponentFixture<EditStrawberryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStrawberryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStrawberryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
