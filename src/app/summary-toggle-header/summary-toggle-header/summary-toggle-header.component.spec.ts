import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryToggleHeaderComponent } from './summary-toggle-header.component';

describe('SummaryToggleHeaderComponent', () => {
  let component: SummaryToggleHeaderComponent;
  let fixture: ComponentFixture<SummaryToggleHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryToggleHeaderComponent]
    });
    fixture = TestBed.createComponent(SummaryToggleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
