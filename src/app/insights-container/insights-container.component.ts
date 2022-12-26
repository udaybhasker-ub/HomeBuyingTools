import { ICalculatedMonthData } from './../interfaces/ICalculatedMonthData';
import { Component, Input, OnInit } from '@angular/core';
import { IOptions } from '../interfaces/IOptions';
import { CalculationUtils } from '../utils/CalculationUtils';
import { Iinsights } from '../interfaces/Iinsights';
import { IChartSeriesEntry, ILineChartEntry, ILineChartData, IInsightChartData } from '../interfaces/ILineChartData';
import { ICalculatedInsights } from '../interfaces/ICalculatedInsights';
import { SeriesLabels } from '../objects/SeriesLabels';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-insights-container',
  templateUrl: './insights-container.component.html',
  styleUrls: ['./insights-container.component.less']
})
export class InsightsContainerComponent implements OnInit {
  @Input() selectedOptions: IOptions;
  @Input() allResults: ICalculatedMonthData[];
  @Input() cumulative: boolean = false;
  @Input() atMonth: number = 1;

  insights: Iinsights;
  dpInsightChartData: IInsightChartData;
  aprInsightChartData: IInsightChartData;
  lossGainChartData: ILineChartData;

  aprAvgMonthCountDiff: number;
  dpAvgMonthCountDiff: number;
  priceInsightChartData: IInsightChartData;
  pricePercentPerAprPercent: number;

  constructor() { }

  ngOnInit(): void {
    this.prepareInsights();
  }

  prepareInsights() {
    if (!this.allResults)
      return;

    this.insights = CalculationUtils.getInsights(this.allResults, this.selectedOptions);

    this.dpInsightChartData = this.prepareInsightData('downpaymentPer', 1, ((data: ICalculatedInsights) => {
      const name = Math.round(data.selectedOptions.price * (data.selectedOptions.downpaymentPer / 100));
      return {
        name,
        value: data.insights.purchaseVsRentBreakEvenMonth,
        isSelected: (name === this.selectedOptions.downpaymentAmt)
      };
    }), '$');
    this.aprInsightChartData = this.prepareInsightData('apr', 0.5, undefined, '%', true);
    this.priceInsightChartData = this.prepareInsightData('price', 10000, undefined, '$', true);
    this.lossGainChartData = {
      chartName: "Yr Vs Loss/Gain",
      entries: this.getLossGainChartEntries(),
      selectedValue: Math.round(this.insights.purchaseVsRentBreakEvenMonth / 12).toString()
    };;

    this.calculateRatio();
  }

  getLossGainChartEntries() {
    const results = new Map<number, ICalculatedMonthData[]>();
    [2, 3, 4, 5, 6, 7].forEach((appreciationRate) => {
      const selOptions = {
        ...this.selectedOptions, ...{
          additionalOptions: {
            ...this.selectedOptions.additionalOptions, ...{
              houseValueAppreciationPer: appreciationRate
            }
          }
        }
      }
      const perAppr: ICalculatedMonthData[] = CalculationUtils.calculateDataMatrix(selOptions, selOptions.loanLength * 12);
      results.set(appreciationRate, perAppr);
    });
    let entries: ILineChartEntry[] = [];
    results.forEach((value: ICalculatedMonthData[], key: number) => {
      const series: IChartSeriesEntry[] = [];
      value.forEach((month: ICalculatedMonthData) => {
        const yr = month.atMonth.month % 12;
        if (yr === 0 && month.atMonth.month < this.insights.purchaseVsRentBreakEvenMonth + 24) {
          const seriesEntry: IChartSeriesEntry = {
            name: (month.atMonth.month / 12).toString(),
            value: month.cumulative.buyingVsRentingDiff
          };
          series.push(seriesEntry);
        }
      });
      const entry: ILineChartEntry = {
        name: key + "% Appr.",
        series: series
      };
      entries.push(entry);
    });
    return entries;
  }

  calculateRatio() {
    const monthsPerAPR = this.aprInsightChartData.step / this.aprInsightChartData.avgDeltaDiff;
    const monthsPerCostPer = ((this.priceInsightChartData.step / this.selectedOptions.price) * 100) / this.priceInsightChartData.avgDeltaDiff;
    this.pricePercentPerAprPercent = monthsPerCostPer / monthsPerAPR;
  }

  prepareInsightData(param: string, step: number, getKV?: any, labelAppend: string = '', desc: boolean = false): IInsightChartData {
    const insightDataMatrix = CalculationUtils.getInsightMatrix(this.selectedOptions, param, step, desc);
    const monthsRange = insightDataMatrix.map((insightsData: ICalculatedInsights) => insightsData.insights.purchaseVsRentBreakEvenMonth);
    const avgDeltaDiff = Math.abs(CalculationUtils.averageDelta(monthsRange));
    const chartData: ILineChartData = this.prepareChartData((SeriesLabels[param] || param) + " - Break-even Month", insightDataMatrix,
      getKV || ((data: ICalculatedInsights) => {
        const name = data.selectedOptions[param];
        return {
          name,
          value: data.insights.purchaseVsRentBreakEvenMonth,
          isSelected: (name === this.selectedOptions[param])
        };
      }), labelAppend);
    return {
      param,
      chartData,
      avgDeltaDiff,
      step
    }
  }

  prepareChartData(name: string, data: ICalculatedInsights[], getValue: any, labelAppender: string): ILineChartData {
    var chartEntries: ILineChartEntry[] = [];
    let series = [];
    let selectedValue = "";

    data.forEach((insightsData: ICalculatedInsights, index: number) => {
      const { name, value, isSelected } = getValue(insightsData);

      const seriesEntry: IChartSeriesEntry = {
        name: labelAppender === '$' ? '$' + name : name + labelAppender,
        value
      };

      if (isSelected)
        selectedValue = seriesEntry.name;

      series.push(seriesEntry);
    });

    chartEntries.push({ name, series });

    return {
      chartName: name,
      entries: chartEntries,
      selectedValue
    };
  }
}
