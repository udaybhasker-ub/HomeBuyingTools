import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSummaryComponent } from './additional-summary.component';

describe('AdditionalSummaryComponent', () => {
  let component: AdditionalSummaryComponent;
  let fixture: ComponentFixture<AdditionalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
