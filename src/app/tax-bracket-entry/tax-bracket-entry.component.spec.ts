import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxBracketEntryComponent } from './tax-bracket-entry.component';

describe('TaxBracketEntryComponent', () => {
  let component: TaxBracketEntryComponent;
  let fixture: ComponentFixture<TaxBracketEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxBracketEntryComponent]
    });
    fixture = TestBed.createComponent(TaxBracketEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
