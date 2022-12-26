import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCompactSummaryCardComponent } from './default-compact-summary-card.component';

describe('DefaultCompactSummaryCardComponent', () => {
  let component: DefaultCompactSummaryCardComponent;
  let fixture: ComponentFixture<DefaultCompactSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultCompactSummaryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultCompactSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
