import { ICalculatedMonthParams } from "../interfaces/ICalculatedMonthData";

export class CalculatedMonthParams implements ICalculatedMonthParams {
  totalCost: number = 0;
  downpayment: number = 0;
  loanAmt: number = 0;
  month: number = 0;
  principal: number = 0;
  interest: number = 0;
  emi: number = 0;
  pmi: number = 0;
  propertyTax: number = 0;
  homeInsuranceCost: number = 0;
  hoaMonthly: number = 0;
  maintainanceCost: number = 0;
  otherCosts: number = 0;
  homeAppreciatedAmt: number = 0;
  buyerClosingCost: number = 0;
  closingCost: number = 0;
  actualBuyingCost: number = 0;
  actualBuyingCostPerMonthAVG: number = 0;
  buyingVsRentingDiff: number = 0;
  rentingAvailableCash: number = 0;
  loanBalance: number = 0;
  taxSavings: number = 0;
  rentalCost: number = 0;
  oppertunityCost: number = 0;
  nettBuyingVsInvestingDiff: number = 0;
}
