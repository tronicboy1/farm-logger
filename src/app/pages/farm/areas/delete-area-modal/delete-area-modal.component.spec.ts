import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAreaModalComponent } from './delete-area-modal.component';

describe('DeleteAreaModalComponent', () => {
  let component: DeleteAreaModalComponent;
  let fixture: ComponentFixture<DeleteAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteAreaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
