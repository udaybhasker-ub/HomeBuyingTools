export interface IChartSeriesEntry {
  name: string,
  value: number
}

export interface ILineChartEntry {
  name: string,
  series: IChartSeriesEntry[]
}

export interface ILineChartData {
  chartName: string,
  entries: ILineChartEntry[],
  selectedValue: string
}

export interface IInsightChartData {
  param: string,
  chartData: ILineChartData,
  avgDeltaDiff: number,
  step: number
}
