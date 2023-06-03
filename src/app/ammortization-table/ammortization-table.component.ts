import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { SeriesLabels } from '../objects/SeriesLabels';
import { ICalculatedMonthData } from '../interfaces/ICalculatedMonthData';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-ammortization-table',
  templateUrl: './ammortization-table.component.html',
  styleUrls: ['./ammortization-table.component.less'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AmmortizationTableComponent implements OnInit {
  @Input() results: ICalculatedMonthData[];

  dataSource = [];
  columnsToDisplay: string[] = ['Year', 'month', 'principal', 'apr', 'interest', 'emi', 'otherCosts', 'totalCost', 'loanBalance'];
  columnsToDisplayWithExpand: string[] = [...this.columnsToDisplay, 'expand'];
  expandedElement;
  SeriesLabels = SeriesLabels;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.prepareData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepareData();
  }

  prepareData() {
    const results = this.results
      .map((month: ICalculatedMonthData) => {
        let object = {};
        this.columnsToDisplay.forEach(col => {
          if (col === 'Year') {
            let val = Math.floor(month.atMonth.month / 12);
            object[col] = val + (month.atMonth.month % 12 === 0 ? 0 : 1);
          } else {
            object[col] = month.atMonth[col];
          }

        });
        return object;
      });
    this.dataSource = results;
  }

  ngAfterViewInit(): void {
    const childRows = this.el.nativeElement.querySelectorAll('tr.month-level-row');
    childRows.forEach((el) => {
      el.classList.add('contracted');
    });
  }

  toggleExpand(element, event: Event) {
    event.stopPropagation();

    const expandRow = this.el.nativeElement.querySelector('tr.year-level-row[data-year="' + element['Year'] + '"]');
    const expanded = expandRow.classList.contains('expanded');

    const childRows = this.el.nativeElement.querySelectorAll('tr.month-level-row[data-year="' + element['Year'] + '"]');
    childRows.forEach((el) => {
      expanded ? el.classList.add('contracted') : el.classList.remove('contracted');
    });
    expanded ? expandRow.classList.remove('expanded') : expandRow.classList.add('expanded');
  }
}
