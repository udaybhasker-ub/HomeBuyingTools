import { Component, ElementRef, Input, OnInit, Output, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-range-indicator',
  templateUrl: './range-indicator.component.html',
  styleUrls: ['./range-indicator.component.less']
})
export class RangeIndicatorComponent implements OnInit {
  @Input() dimensions: number[] = [250, 20];
  @Input() range: number[];
  @Input() colorRange: string[] = ['#84fee3', '#f8958e'];
  @Input() selection: number;
  @Input() ideal: number;
  @Input() labelString: string = '';

  @ViewChild("rangeIndicator") rangeIndicator: ElementRef;
  @ViewChild("rangeLine") rangeLine: ElementRef;
  @ViewChild("rangeIdealLine") rangeIdealLine: ElementRef;

  @ViewChild("labels") labels: ElementRef;
  @ViewChild("minLabel") minLabel: ElementRef;
  @ViewChild("selectedLabel") selectedLabel: ElementRef;
  @ViewChild("idealLabel") idealLabel: ElementRef;
  @ViewChild("maxLabel") maxLabel: ElementRef;

  constructor(private renderer: Renderer2, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngAfterViewChecked() {
    const [width, height] = this.dimensions;
    let [min, max] = this.range;

    max = Math.round(max);
    min = Math.round(min);
    this.ideal = Math.round(this.ideal);
    this.selection = Math.round(this.selection);

    this.renderer.setStyle(this.rangeIndicator.nativeElement, 'width', width + 'px');
    this.renderer.setStyle(this.rangeIndicator.nativeElement, 'height', height + 'px');
    this.renderer.setStyle(this.rangeIndicator.nativeElement, 'background', 'linear-gradient(0.25turn, ' + this.colorRange[0] + ', ' + this.colorRange[1] + ')');

    const unit = ((max - min) / width) * 100;
    const sel = this.selection / max;
    let lineWidth = sel * width;

    if (!this.ideal || this.ideal < min && this.ideal > max) {
      this.ideal = -1;
    }

    this.labelString = this.labelString ? (' ' + this.labelString) : '';

    const idealSel = this.ideal / max;
    let idealLineWidth = idealSel * width;

    if (lineWidth > width)
      lineWidth = width;

    if (idealLineWidth > width)
      idealLineWidth = width;


    this.renderer.setStyle(this.rangeLine.nativeElement, 'width', lineWidth + 'px');
    this.renderer.setStyle(this.rangeIdealLine.nativeElement, 'width', idealLineWidth + 'px');

    const minWidth = this.minLabel.nativeElement.offsetWidth,
      selWidth = this.selectedLabel.nativeElement.offsetWidth,
      idealWidth = this.idealLabel.nativeElement.offsetWidth,
      maxWidth = this.maxLabel.nativeElement.offsetWidth;


    this.renderer.setStyle(this.minLabel.nativeElement, 'left', -(minWidth / 2) + 'px');

    this.renderer.setStyle(this.idealLabel.nativeElement, 'left', (idealLineWidth - (selWidth / 2) - minWidth) + 'px');

    this.renderer.setStyle(this.selectedLabel.nativeElement, 'left', (lineWidth - (idealWidth / 2)) + 'px');

    this.renderer.setStyle(this.maxLabel.nativeElement, 'left', (width - (maxWidth / 2) - minWidth - selWidth) + 'px');

    this.cd.detectChanges();
  }

}
