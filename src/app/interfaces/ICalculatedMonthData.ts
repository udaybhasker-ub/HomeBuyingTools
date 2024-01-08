export interface ICalculatedMonthParams {
  month: number;
  apr: number;

  downpayment: number;
  loanAmt: number;
  buyerClosingCost: number;
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
  totalMonthlyPayment: number;

  loanBalance: number;
  homeValueAppreciatedAmt: number;
  equity: number;
  closingCostAtSold: number;
  totalBuyingCost: number;
  netBuyingCost: number;
  netBuyingCostPerMonthAVG: number;
  rentalCost: number;
  cashAvailableForInvesting: number;
  returnOnInvestment: number;
  netRentalCost: number;
  netInvestingToBuyingDifference: number;
}


export interface ICalculatedMonthData {
  atMonth: ICalculatedMonthParams;
  cumulative: ICalculatedMonthParams;
}
