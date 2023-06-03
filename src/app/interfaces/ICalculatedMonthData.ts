export interface ICalculatedMonthParams {
  month: number;
  apr: number;

  downpayment: number;
  loanAmt: number;
  buyerClosingCost: number,
  hoaMonthly: number;
  propertyTax: number;
  homeInsuranceCost: number;
  taxSavings: number;

  principal: number;
  interest: number;
  emi: number;
  pmi: number;
  maintainanceCost: number;
  otherCosts: number;
  totalCost: number;

  loanBalance: number;
  homeAppreciatedAmt: number;
  closingCost: number;
  actualBuyingCost: number;
  actualBuyingCostPerMonthAVG: number;
  rentalCost: number;
  buyingVsRentingDiff: number;
  rentingAvailableCash: number;
  oppertunityCost: number;
  nettBuyingVsInvestingDiff: number;
}


export interface ICalculatedMonthData {
  atMonth: ICalculatedMonthParams;
  cumulative: ICalculatedMonthParams;
}
