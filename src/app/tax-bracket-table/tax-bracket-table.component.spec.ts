import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxBracketTableComponent } from './tax-bracket-table.component';

describe('TaxBracketTableComponent', () => {
  let component: TaxBracketTableComponent;
  let fixture: ComponentFixture<TaxBracketTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxBracketTableComponent]
    });
    fixture = TestBed.createComponent(TaxBracketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
