import { ICalculatedMonthData, ICalculatedMonthParams } from './../interfaces/ICalculatedMonthData';
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
  lgApprRateOptions: number[] = Array.from({ length: 21 }, (_, i) => i - 10);
  selectedLgApprRate: number = 5;

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
    this.updateLossGainChart();
    //this.calculateRatio();
    this.updateAprVsPriceInsight();
  }

  updateLossGainChart() {
    this.lossGainChartData = {
      chartName: "Yr Vs Loss/Gain",
      entries: this.getLossGainChartEntries(this.selectedLgApprRate),
      selectedValue: Math.round(this.insights.purchaseVsRentBreakEvenMonth / 12).toString()
    };
  }

  updateAprVsPriceInsight() {
    const testOptions = {
      ...this.selectedOptions,
      apr: this.selectedOptions.apr - 1,
      additionalOptions: {
        ...this.selectedOptions.additionalOptions,
        avgReturnOnInvestmentPer: 0,
        refinanceAfterMonthsCount: 0,
        estimatedRefinanceAprChangePercent: 0,
        returnOnInvestment: 0
      }
    };
    const calcData: ICalculatedMonthData[] =
      CalculationUtils.calculateDataMatrix(testOptions, this.selectedOptions.loanLength * 12);
    const targetData = calcData[(this.selectedOptions.loanLength * 12) - 1].cumulative;
    const equivalentPriceData: { data: ICalculatedMonthParams, price: number } = this.findEquivalentPrice(this.selectedOptions.price, targetData, 'totalMonthlyPayment');
    this.pricePercentPerAprPercent = ((this.selectedOptions.price - equivalentPriceData.price) / this.selectedOptions.price) * 100;
  }

  private findEquivalentPrice(targetPrice: number, targetData: ICalculatedMonthParams, comparisionField: keyof ICalculatedMonthParams): { data: ICalculatedMonthParams, price: number } {

    const targetComparisionValue = targetData[comparisionField];
    let low = 0;
    let high = targetPrice;
    const tolerance = 100;

    while (low <= high) {
      const mid = (low + high) / 2;
      const testOptions = {
        ...this.selectedOptions,
        price: mid,
        additionalOptions: {
          ...this.selectedOptions.additionalOptions,
          avgReturnOnInvestmentPer: 0,
          refinanceAfterMonthsCount: 0,
          estimatedRefinanceAprChangePercent: 0,
          returnOnInvestment: 0
        }
      };
      const calcData: ICalculatedMonthData[] =
        CalculationUtils.calculateDataMatrix(testOptions, this.selectedOptions.loanLength * 12);
      const currentData = calcData[(this.selectedOptions.loanLength * 12) - 1].cumulative;
      const currentValue = currentData[comparisionField];
      if (Math.abs(currentValue - targetComparisionValue) < tolerance) {
        return { data: currentData, price: mid };
      } else if (currentValue < targetComparisionValue) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return null; // If no equivalent loan amount is found
  }


  getLossGainChartEntries(selectedApprRate) {
    const results = new Map<string, ICalculatedMonthData[]>();
    const apprRoiMap = new Map<string, Map<number, number>>();
    const defaultRoi = this.selectedOptions.additionalOptions.avgReturnOnInvestmentPer;
    apprRoiMap.set(selectedApprRate + '% Home Appr. - ' + defaultRoi + '% ROI', new Map<number, number>().set(selectedApprRate, defaultRoi));

    if (this.selectedOptions.additionalOptions.avgReturnOnInvestmentPer != 0) {
      apprRoiMap.set(selectedApprRate + '% Home Appr. - ' + 0 + '% ROI', new Map<number, number>().set(selectedApprRate, 0));
    }
    apprRoiMap.forEach((map, key) => {
      const [houseValueAppreciationPer, avgReturnOnInvestmentPer] = map.entries().next().value;
      const selOptions = {
        ...this.selectedOptions, ...{
          additionalOptions: {
            ...this.selectedOptions.additionalOptions, ...{
              houseValueAppreciationPer,
              avgReturnOnInvestmentPer
            }
          }
        }
      }
      const perAppr: ICalculatedMonthData[] =
        CalculationUtils.calculateDataMatrix(selOptions, selOptions.loanLength * 12);
      results.set(key, perAppr);
    });
    let entries: ILineChartEntry[] = [];
    results.forEach((value: ICalculatedMonthData[], key: string) => {
      const series1: IChartSeriesEntry[] = [];

      value.forEach((month: ICalculatedMonthData) => {
        const yr = month.atMonth.month % 12;
        if (yr === 0 && month.atMonth.month < this.selectedOptions.loanLength * 12) {
          const seriesEntry2: IChartSeriesEntry = {
            name: (month.atMonth.month / 12).toString(),
            value: -month.cumulative.netInvestingToBuyingDifference
          };
          series1.push(seriesEntry2);
        }
      });
      const entry1: ILineChartEntry = {
        name: 'Net difference with ' + key,
        series: series1
      };
      entries.push(entry1);
    });
    return entries;
  }

  /*calculateRatio() {
    const monthsPerAPR = this.aprInsightChartData.step / this.aprInsightChartData.avgDeltaDiff;
    const monthsPerCostPer = ((this.priceInsightChartData.step / this.selectedOptions.price) * 100) / this.priceInsightChartData.avgDeltaDiff;
    this.pricePercentPerAprPercent = monthsPerCostPer / monthsPerAPR;
  }*/

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
