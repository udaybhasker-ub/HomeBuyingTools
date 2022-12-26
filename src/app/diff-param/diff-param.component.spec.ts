import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffParamComponent } from './diff-param.component';

describe('DiffParamComponent', () => {
  let component: DiffParamComponent;
  let fixture: ComponentFixture<DiffParamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffParamComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
