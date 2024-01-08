import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownCalculationComponent } from './breakdown-calculation.component';

describe('BreakdownCalculationComponent', () => {
  let component: BreakdownCalculationComponent;
  let fixture: ComponentFixture<BreakdownCalculationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreakdownCalculationComponent]
    });
    fixture = TestBed.createComponent(BreakdownCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
