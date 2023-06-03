import { SharedService } from './../services/shared/shared.service';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IOptions } from '../interfaces/IOptions';
import { ISliderData } from '../interfaces/ISliderData';
import { createPopper, VirtualElement, Instance, popper } from '@popperjs/core';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { Options } from '../objects/Options';
import { CalculationUtils } from '../utils/CalculationUtils';

@Component({
  selector: 'app-dp-vs-apr-data-table',
  templateUrl: './dp-vs-apr-data-table.component.html',
  styleUrls: ['./dp-vs-apr-data-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DpVsAprDataTableComponent implements OnInit {
  calculateDataMatrix: any;
  userSelectedOptions: IOptions | undefined;
  sliderOptions: ISliderData | undefined;
  resultsArray: IOptions[][];
  showSummaryDetails: boolean = false;
  tableHeaders = {
    dp: [],
    apr: [],
  };

  @ViewChild("summarySnippet", { read: ViewContainerRef }) summarySnippet!: ViewContainerRef;
  @ViewChild("tooltip", { read: ViewContainerRef }) tooltip!: ViewContainerRef;
  popper: Instance;
  comparisonItems: IOptions[];

  constructor(private sharedService: SharedService) {
    this.calculateDataMatrix = CalculationUtils.calculateDataMatrix;
  }

  ngOnInit(): void {
    this.sharedService.optionsUpdated.subscribe((data: IOptions) => {
      if (!Object.keys(data).length) return;

      this.userSelectedOptions = data;
      this.selectionsUpdated();
    });

    this.sharedService.sliderDataUpdated.subscribe((data: ISliderData) => {
      if (!Object.keys(data).length) return;

      this.sliderOptions = data;
      this.selectionsUpdated();
    });

    this.sharedService.updateSelections.subscribe((result: IOptions[]) => {
      let selectedCount = 0;

      this.resultsArray.forEach(row => {
        row.forEach((cell: IOptions) => {
          const found = result.length && result.find(item => item.equal(cell));
          cell.selectedForComparision = !!found;

          if (found)
            selectedCount++;
        });
      });

      this.comparisonItems = result;
    });
  }

  selectionsUpdated() {
    let dpHeaders = this.generateHeaders(
      this.sliderOptions?.dpData.value || 0,
      this.sliderOptions?.dpData.highValue || 0,
      1
    );

    if (dpHeaders.find(i => i == this.userSelectedOptions.downpaymentPer) === undefined) {
      dpHeaders.push(this.userSelectedOptions.downpaymentPer);
    }
    dpHeaders = dpHeaders.sort((a, b) => a - b);
    this.tableHeaders.dp = dpHeaders;

    let aprHeaders = this.generateHeaders(
      this.sliderOptions?.aprData.value || 0,
      this.sliderOptions?.aprData.highValue || 0,
      0.5
    );
    if (aprHeaders.find(i => i == this.userSelectedOptions.apr) === undefined) {
      aprHeaders.push(this.userSelectedOptions.apr);
    }
    aprHeaders = aprHeaders.sort((a, b) => b - a);
    //aprHeaders = aprHeaders.reverse();
    this.tableHeaders.apr = aprHeaders;

    let resultsArray = Array.from(
      Array(aprHeaders.length),
      () => new Array(dpHeaders.length)
    );

    dpHeaders.forEach((dpPerItem, i) => {
      aprHeaders.forEach((aprItem, j) => {
        let cell: Options = new Options({
          ...this.userSelectedOptions,
          ...{
            apr: aprItem,
            downpaymentPer: dpPerItem,
          }
        });

        if (this.userSelectedOptions.equal(cell))
          cell.userSelectedItem = true;

        resultsArray[j][i] = cell;
      });
    });
    this.resultsArray = resultsArray;
    this.sharedService.addToCompare.next(new Options({
      ...this.userSelectedOptions,
      ...{
        userSelectedItem: true,
        selectedForComparision: true
      }
    }));
  }

  generateHeaders(start: number, stop: number, step: number): number[] {
    return Array(Math.ceil((stop - start) / step + 1))
      .fill(start)
      .map((x, y) => x + y * step);
  }

  @HostListener('document:click', ['$event'])
  public onGlobalClick(event: Event) {
    const path = event.composedPath();
    if (!path) return;
    let compareBtn = path.find((e: HTMLElement) => {
      return e.classList && 
      (e.classList.contains("compare-btn") || e.classList.contains("compare-footer-btn"));
    });
    let elementRefInPath = path.find(e => e === this.tooltip.element.nativeElement);
    if (compareBtn || !elementRefInPath) {
      this.closePopper();
    }
  }

  selectedValue(item: IOptions, event: Event) {
    this.summarySnippet.clear();

    const componentRef = this.summarySnippet.createComponent<SummaryCardComponent>(SummaryCardComponent);
    componentRef.instance.selectedOptions = item;
    componentRef.instance.showSummaryDetails = this.showSummaryDetails;
    componentRef.instance.lastItemUserSelected = (this.comparisonItems.length === 1 && item.userSelectedItem && item.equal(this.comparisonItems[0]));

    this.closePopper();
    this.tooltip.element.nativeElement.style.setProperty("display", "block");

    this.popper = createPopper(
      (event.target as Element),
      this.tooltip.element.nativeElement, {
      placement: "top"
    });

    (event.target as Element).classList.add('selected-val-secondary');
    event.stopPropagation();
  }
  closePopper() {
    if (!this.popper) return;

    this.popper.state.elements.popper.style.setProperty("display", "none");
    (this.popper.state.elements.reference as Element).classList.remove("selected-val-secondary");
  }
}
