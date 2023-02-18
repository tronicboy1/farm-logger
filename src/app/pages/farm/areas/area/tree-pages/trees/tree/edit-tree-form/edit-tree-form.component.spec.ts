import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTreeFormComponent } from './edit-tree-form.component';

describe('EditTreeFormComponent', () => {
  let component: EditTreeFormComponent;
  let fixture: ComponentFixture<EditTreeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTreeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTreeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
