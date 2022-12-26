import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactLineChartComponent } from './compact-line-chart.component';

describe('CompactLineChartComponent', () => {
  let component: CompactLineChartComponent;
  let fixture: ComponentFixture<CompactLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompactLineChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompactLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
