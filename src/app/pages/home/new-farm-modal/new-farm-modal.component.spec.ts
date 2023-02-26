import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFarmModalComponent } from './new-farm-modal.component';

describe('NewFarmModalComponent', () => {
  let component: NewFarmModalComponent;
  let fixture: ComponentFixture<NewFarmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFarmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFarmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
