import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAreaFormComponent } from './delete-area-form.component';

describe('DeleteAreaFormComponent', () => {
  let component: DeleteAreaFormComponent;
  let fixture: ComponentFixture<DeleteAreaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteAreaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAreaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
