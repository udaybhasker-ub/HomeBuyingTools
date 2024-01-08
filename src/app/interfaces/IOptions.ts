import { IAdditionalOptions } from "./IAdditionalOptions";

export interface IOptions {
  price: number,
  loanLength: number;
  apr: number;
  downpaymentPer: number;
  downpaymentAmt: number;
  propertyTaxPer: number;
  homeInsRate: number;
  pmiRate: number;
  hoaMonthly: number;
  maintainanceCostPer: number;
  buyerclosingCostPer?: number,
  userSelectedItem?: boolean;
  selectedForComparision?: boolean;
  atMonth?: number;
  additionalOptions?: IAdditionalOptions;

  equal(data2: IOptions): boolean;
}
