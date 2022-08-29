import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryLineChartComponent } from './summary-line-chart.component';

describe('SummaryLineChartComponent', () => {
  let component: SummaryLineChartComponent;
  let fixture: ComponentFixture<SummaryLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryLineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
