import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFarmFormComponent } from './delete-farm-form.component';

describe('DeleteFarmFormComponent', () => {
  let component: DeleteFarmFormComponent;
  let fixture: ComponentFixture<DeleteFarmFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFarmFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteFarmFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
