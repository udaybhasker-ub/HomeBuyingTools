import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmmortizationTableComponent } from './ammortization-table.component';

describe('AmmortizationTableComponent', () => {
  let component: AmmortizationTableComponent;
  let fixture: ComponentFixture<AmmortizationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmmortizationTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmmortizationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
