import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpVsAprDataTableComponent } from './dp-vs-apr-data-table.component';

describe('DpVsAprDataTableComponent', () => {
  let component: DpVsAprDataTableComponent;
  let fixture: ComponentFixture<DpVsAprDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpVsAprDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpVsAprDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
