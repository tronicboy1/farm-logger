import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAreaModalComponent } from './new-area-modal.component';

describe('NewAreaModalComponent', () => {
  let component: NewAreaModalComponent;
  let fixture: ComponentFixture<NewAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAreaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
