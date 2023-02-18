import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrawberriesComponent } from './strawberries.component';

describe('StrawberriesComponent', () => {
  let component: StrawberriesComponent;
  let fixture: ComponentFixture<StrawberriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrawberriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrawberriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
