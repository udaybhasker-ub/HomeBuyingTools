import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ICalculatedMonthData, ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';
import { IOptions } from '../interfaces/IOptions';
import { SharedService } from '../services/shared/shared.service';
import { CalculationUtils } from '../utils/CalculationUtils';
import { Iinsights } from '../interfaces/Iinsights';


@Component({
  selector: 'app-selected-summary',
  templateUrl: './selected-summary.component.html',
  styleUrls: ['./selected-summary.component.less']
})
export class SelectedSummaryComponent implements OnInit {
  @Input() selectedOptions: IOptions;
  data: ICalculatedMonthParams;
  @Input() cumulative: boolean = false;
  @Input() atMonth: number = 1;

  displayedCategories: string[] = ["principal", "interest", "pmi", "propertyTax", "homeInsuranceCost", "maintainanceCost", "hoaMonthly"];
  allResults: ICalculatedMonthData[];
  insights: Iinsights;
  previousMonthData: ICalculatedMonthParams;
  lineChartDefaultCategories: string[] = ["principal", "interest", "otherCosts", "totalMonthlyPayment"];
  lineChartCategories: string[] = this.lineChartDefaultCategories;
  chartOffset: any;
  chartOriginalWidth: any;

  @ViewChild("lineChart", { read: ElementRef }) lineChart: ElementRef;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.allResults = CalculationUtils.calculateDataMatrix(this.selectedOptions, this.selectedOptions.loanLength * 12);
    this.updateData();
  }

  ngOnChanges() {
    this.updateData();
  }

  prepareInsights() {
    if (!this.allResults)
      return;

    this.insights = CalculationUtils.getInsights(this.allResults, this.selectedOptions);
  }

  onSummaryItemHover(...type) {
    this.lineChartCategories = type;
  }

  onSummaryItemUnhover() {
  }

  resetChart() {
    this.lineChartCategories = [...this.lineChartDefaultCategories];
  }

  updateData() {
    if (!(this.allResults && this.allResults.length))
      return;

    this.data = this.getCalculatedParams(this.atMonth);
    this.previousMonthData = this.getCalculatedParams(this.atMonth - 1);

    this.prepareInsights();
  }

  getCalculatedParams(atMonth: number, forceCumulative: boolean = false): ICalculatedMonthParams {
    const result = this.allResults[atMonth - 1];
    return result && ((this.cumulative || forceCumulative) ? result.cumulative : result.atMonth);
  }

  @HostListener('window:resize')
  onResize() {
    this.onLoad();
  }

  @HostListener('window:load')
  onLoad() {
    this.chartOffset = this.lineChart?.nativeElement.offsetTop;
    this.chartOriginalWidth = this.lineChart?.nativeElement.clientWidth;

    this.onScroll();
  }

  @HostListener('window:scroll')
  onScroll() {
    var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (bodyScrollTop > this.chartOffset + 900) {
      this.lineChart?.nativeElement.classList.add('fixed');
      //this.lineChart.nativeElement.setAttribute("style", "width: " + this.chartOriginalWidth + "px; top: -18px");
    } else {
      this.lineChart?.nativeElement.classList.remove('fixed');
      //this.lineChartCategories = [...this.lineChartDefaultCategories];
    }
  }
}
