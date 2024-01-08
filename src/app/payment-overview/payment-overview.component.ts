import { IOptions } from './../interfaces/IOptions';
import { Component, ElementRef, HostListener, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';
import { CalculationUtils } from '../utils/CalculationUtils';
import { ICalculatedMonthData, ICalculatedMonthParams } from '../interfaces/ICalculatedMonthData';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSelectChange } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Options } from 'ngx-slider-v2';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.less']
})
export class PaymentOverviewComponent implements OnInit {
  comparedItems: IOptions[] = [];
  diffTableData: ICalculatedMonthParams[];
  allCalculatedData: ICalculatedMonthData[];
  userSelectedOptions: IOptions[] = [];

  sliderOptions: Options = {
    floor: 1,
    ceil: 360,
    step: 1
  };
  atMonth = 1;
  atMonthUpdate = new Subject<number>();
  selectedAtOption = "At";
  cumulative: boolean = false;

  @ViewChild("tabGroup", { static: false }) tabGroup: MatTabGroup;
  @ViewChild("settingsHeader", { static: false }) settingsHeader: ElementRef;
  headerOffset: any;
  headerOriginalWidth: string;

  constructor(private sharedService: SharedService) {
    this.atMonthUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.atMonth = value;
        this.userSelectedOptions[0].atMonth = value;

        this.sharedService.updateNavOptions.next({
          cumulative: this.cumulative,
          atMonth: value
        });
      });
  }

  ngOnInit(): void {
    this.sharedService.addToCompare.subscribe((options: IOptions) => {
      if (!Object.keys(options).length) return;

      const existed = this.comparedItems.find(item => item.equal(options));

      if (existed && !options.userSelectedItem)
        return;

      if (options.userSelectedItem) {
        this.comparedItems = this.comparedItems.filter(item => !item.equal(options) && !item.userSelectedItem);
        this.userSelectedOptions = [];
        this.userSelectedOptions.push(options);
        this.allCalculatedData = CalculationUtils.calculateDataMatrix(options, options.loanLength * 12);
      }

      if (this.comparedItems.length > 2) {
        let selected = this.comparedItems.filter(item => item.userSelectedItem);
        let nonSelectedItems = this.comparedItems.filter(item => !item.userSelectedItem);
        nonSelectedItems.sort(this.sortByMonthlyPaymentAmount);
        const removedItem = nonSelectedItems.pop();
        this.sharedService.removeFromCompare.next(removedItem);
        this.comparedItems = [options, ...selected, ...nonSelectedItems];
      } else {
        this.comparedItems.push(options);
      }

      this.comparedItems.sort(this.sortByMonthlyPaymentAmount);
      this.createDiffTables();
      this.sharedService.updateSelections.next(this.comparedItems);
      this.switchTab(options.userSelectedItem ? 0 : 1);
    });

    this.sharedService.removeFromCompare.subscribe((result: IOptions) => {
      this.onComparisionItemRemoved(result);
    });

    this.sharedService.updateNavOptions.subscribe((result: any) => {
      if (!Object.keys(result).length) return;

      this.selectedAtOption = result.cumulative ? 'Until' : 'At';
      this.createDiffTables();
    });
    this.sharedService.changeNavOptions.subscribe((result: any) => {
      if (!Object.keys(result).length) return;

      this.cumulative = result.cumulative;
      this.selectedAtOption = result.cumulative ? 'Until' : 'At';
      this.atMonthUpdate.next(result.atMonth);
    });

  }

  private onComparisionItemRemoved(options: IOptions, forceRemoveSelected = false) {
    if (!Object.keys(options).length) return;

    if (this.comparedItems.length === 1 && this.comparedItems[0].userSelectedItem && !forceRemoveSelected)
      return;

    const existedIndex = this.comparedItems.findIndex(item => item.equal(options));
    if (existedIndex > -1) {
      this.comparedItems.splice(existedIndex, 1);
      this.createDiffTables();
    }
    if (this.comparedItems.length < 1 && this.userSelectedOptions && !forceRemoveSelected) {
      //this.resultData.push(this.userSelectedOptions);
      this.sharedService.addToCompare.next(this.userSelectedOptions[0]);
    }
    this.sharedService.updateSelections.next(this.comparedItems);

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedAtOption = this.cumulative ? 'Until' : 'At';
    this.sliderOptions.ceil = this.userSelectedOptions[0]?.loanLength * 12;
  }

  onAtOptionChange(event: MatSelectChange) {
    this.cumulative = (event.value === 'Until');

    this.sharedService.updateNavOptions.next({
      cumulative: this.cumulative,
      atMonth: this.atMonth
    });
  }

  moveSlider(direction: string) {
    const step = 6;
    if (direction === 'left') {
      const val = this.atMonth - step;
      this.atMonth = val < 1 ? 1 : val;
    } else if (direction === 'right') {
      const val = this.atMonth + (this.atMonth === 1 ? step - 1 : step);
      const max = this.userSelectedOptions[0].loanLength * 12;

      this.atMonth = (val > max) ? max : val;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.onLoad();
  }

  @HostListener('window:load')
  onLoad() {
    this.headerOffset = this.settingsHeader.nativeElement.offsetTop;
    this.headerOriginalWidth = this.settingsHeader.nativeElement.clientWidth;

    this.onScroll();
  }

  @HostListener('window:scroll')
  onScroll() {
    var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (bodyScrollTop > this.headerOffset) {
      this.settingsHeader.nativeElement.classList.add('fixed');
      this.settingsHeader.nativeElement.setAttribute("style", "width: " + this.headerOriginalWidth + "px; top: -18px");
    } else {
      this.settingsHeader.nativeElement.classList.remove('fixed');
    }
  }

  switchTab(index: number) {
    const tabGroup = this.tabGroup;
    if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

    if (this.tabGroup.selectedIndex === 0)
      tabGroup.selectedIndex = index;
  }

  createDiffTables() {
    let diffTables: ICalculatedMonthParams[] = [], diffTableIndex = 0;
    let prevItem: IOptions;
    this.comparedItems.forEach((item: IOptions, index: number) => {
      if (index > 0 && prevItem) {
        const prevCalculated: ICalculatedMonthParams = this.getCalculatedData(prevItem);
        const itemCalculated: ICalculatedMonthParams = this.getCalculatedData(item);

        Object.keys(prevCalculated).forEach(key => {
          let val = prevCalculated[key];
          if (!isNaN(val)) {
            if (!diffTables[diffTableIndex])
              diffTables[diffTableIndex] = {} as ICalculatedMonthParams;

            diffTables[diffTableIndex][key] = itemCalculated[key] - val;
          }
        });
        diffTableIndex++;
      }
      prevItem = item;
    });

    this.diffTableData = diffTables;
  }

  getCalculatedData(options: IOptions): ICalculatedMonthParams {
    const results = CalculationUtils.calculateDataMatrix(options, this.atMonth);
    let result = {} as ICalculatedMonthParams;
    if (this.cumulative) {
      result = results[results.length - 1].cumulative;
    } else
      result = results[results.length - 1].atMonth;
    return result;
  }

  sortByMonthlyPaymentAmount(n1: IOptions, n2: IOptions) {
    return CalculationUtils.calculateDataMatrix(n1)[0].atMonth.totalMonthlyPayment - CalculationUtils.calculateDataMatrix(n2)[0].atMonth.totalMonthlyPayment
  }

  onInputFocus(event: Event) {
    (event.target as HTMLInputElement).select();
  }

  onPinnedForComparision(options: IOptions) {
    this.onComparisionItemRemoved(options, true);
    this.sharedService.addToCompare.next({
      ...options,
      ...{
        userSelectedItem: false,
        selectedForComparision: true
      }
    } as IOptions);
  }
}
