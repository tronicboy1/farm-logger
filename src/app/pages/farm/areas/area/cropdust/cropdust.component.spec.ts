import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropdustComponent } from './cropdust.component';

describe('CropdustComponent', () => {
  let component: CropdustComponent;
  let fixture: ComponentFixture<CropdustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CropdustComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CropdustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
