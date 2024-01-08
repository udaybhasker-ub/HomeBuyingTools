import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathSnippetComponent } from './math-snippet.component';

describe('MathSnippetComponent', () => {
  let component: MathSnippetComponent;
  let fixture: ComponentFixture<MathSnippetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MathSnippetComponent]
    });
    fixture = TestBed.createComponent(MathSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
