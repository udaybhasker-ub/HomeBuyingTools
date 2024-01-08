import { AfterViewInit, Component, HostListener, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Instance, createPopper } from '@popperjs/core/lib';
import { ICalculatedMonthParams } from 'src/app/interfaces/ICalculatedMonthData';
import { IOptions } from 'src/app/interfaces/IOptions';
import { MathSnippetComponent } from 'src/app/math-snippet/math-snippet/math-snippet.component';

@Component({
  selector: 'app-value-field',
  templateUrl: './value-field.component.html',
  styleUrls: ['./value-field.component.less']
})
export class ValueFieldComponent {

  @Input() displayValue!: string;
  @Input() monthData!: ICalculatedMonthParams;
  @Input() selectedOptions!: IOptions;
  @Input() partial: boolean = false;
  @Input() snippetProperty!: keyof ICalculatedMonthParams;
  @Input() cumulative: boolean = false;

  popper: Instance;

  @ViewChild("mathSnippet", { read: ViewContainerRef }) mathSnippet!: ViewContainerRef;
  @ViewChild("tooltip", { read: ViewContainerRef }) tooltip!: ViewContainerRef;

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: Event) {
    const path = event.composedPath();
    if (!path) return;

    let elementRefInPath = path.find(e => e === this.tooltip.element.nativeElement);
    if (!elementRefInPath) {
      this.closePopper();
    }
  }

  closePopper() {
    this.popper?.state.elements.popper.style.setProperty("display", "none");
  }

  onMouseClick(event: Event) {
    this.mathSnippet.clear();
    const componentRef = this.mathSnippet.createComponent<MathSnippetComponent>(MathSnippetComponent);
    componentRef.instance.property = this.snippetProperty;
    componentRef.instance.monthData = this.monthData;
    componentRef.instance.selectedOptions = this.selectedOptions;
    componentRef.instance.partial = this.partial;
    componentRef.instance.cumulative = this.cumulative;


    this.popper = createPopper(
      (event.target as Element),
      this.tooltip.element.nativeElement, {
      placement: "top"
    });
    this.closePopper();
    event.stopPropagation();
    this.popper?.state.elements.popper.style.setProperty("display", "block");
  }

  onMouseLeave() {
    this.closePopper();
    this.popper.destroy();
  }
}
