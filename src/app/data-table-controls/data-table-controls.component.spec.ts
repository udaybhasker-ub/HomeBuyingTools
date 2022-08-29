import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableControlsComponent } from './data-table-controls.component';

describe('DataTableControlsComponent', () => {
  let component: DataTableControlsComponent;
  let fixture: ComponentFixture<DataTableControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
