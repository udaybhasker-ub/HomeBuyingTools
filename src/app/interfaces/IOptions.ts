import { IAdditionalOptions } from "./IAdditionalOptions";

export interface IOptions {
  price: number,
  loanLength: number;
  apr: number;
  downpaymentPer: number;
  downpaymentAmt: number;
  propertyTaxPer: number;
  homeInsRate: number;
  homeInsAmt: number;
  pmiRate: number;
  hoaMonthly: number;
  maintainanceCostMonthly: number;
  buyerClosingCostsPer?: number,
  userSelectedItem?: boolean;
  selectedForComparision?: boolean;
  atMonth?: number;
  additionalOptions?: IAdditionalOptions;

  equal(data2: IOptions): boolean;
}
