import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPieChartComponent } from './summary-pie-chart.component';

describe('SummaryPieChartComponent', () => {
  let component: SummaryPieChartComponent;
  let fixture: ComponentFixture<SummaryPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryPieChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
