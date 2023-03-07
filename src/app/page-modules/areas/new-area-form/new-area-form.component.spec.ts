import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAreaFormComponent } from './new-area-form.component';

describe('NewAreaFormComponent', () => {
  let component: NewAreaFormComponent;
  let fixture: ComponentFixture<NewAreaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewAreaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewAreaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
