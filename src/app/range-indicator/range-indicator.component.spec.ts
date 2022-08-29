import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeIndicatorComponent } from './range-indicator.component';

describe('RangeIndicatorComponent', () => {
  let component: RangeIndicatorComponent;
  let fixture: ComponentFixture<RangeIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
