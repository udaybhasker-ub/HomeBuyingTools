import { ICalculatedMonthParams } from "../interfaces/ICalculatedMonthData";

export class CalculatedMonthParams implements ICalculatedMonthParams {
  totalMonthlyPayment: number = 0;
  downpayment: number = 0;
  loanAmt: number = 0;
  month: number = 0;
  apr: number = 0;
  principal: number = 0;
  interest: number = 0;
  emi: number = 0;
  pmi: number = 0;
  propertyTax: number = 0;
  homeInsuranceCost: number = 0;
  hoaMonthly: number = 0;
  maintainanceCost: number = 0;
  otherCosts: number = 0;
  homeValueAppreciatedAmt: number = 0;
  equity: number = 0;
  buyerClosingCost: number = 0;
  closingCostAtSold: number = 0;
  totalBuyingCost: number = 0;
  netBuyingCost: number = 0;
  netBuyingCostPerMonthAVG: number = 0;
  cashAvailableForInvesting: number = 0;
  loanBalance: number = 0;
  taxSavings: number = 0;
  rentalCost: number = 0;
  returnOnInvestment: number = 0;
  netRentalCost: number = 0;
  netInvestingToBuyingDifference: number = 0;
}
