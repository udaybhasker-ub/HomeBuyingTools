import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightsContainerComponent } from './insights-container.component';

describe('InsightsContainerComponent', () => {
  let component: InsightsContainerComponent;
  let fixture: ComponentFixture<InsightsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsightsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsightsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
