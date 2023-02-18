import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStrawberryFormComponent } from './new-strawberry-form.component';

describe('NewStrawberryFormComponent', () => {
  let component: NewStrawberryFormComponent;
  let fixture: ComponentFixture<NewStrawberryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewStrawberryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewStrawberryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
