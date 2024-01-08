import { IOptions } from "../interfaces/IOptions";
import * as financial from 'financial';
import { IAdditionalOptions } from "../interfaces/IAdditionalOptions";
import { TaxOptions } from "../interfaces/tax-options.type";

export class Options implements IOptions {
  price: number;
  loanLength: number;
  apr: number;
  downpaymentPer: number;
  downpaymentAmt: number;
  propertyTaxPer: number;
  homeInsRate: number;
  pmiRate: number;
  hoaMonthly: number;
  userSelectedItem?: boolean;
  selectedForComparision?: boolean;
  atMonth?: number;
  maintainanceCostPer: number;
  buyerclosingCostPer?: number;
  additionalOptions: IAdditionalOptions;
  taxOptions: TaxOptions;

  public constructor(init: Partial<Options>) {
    Object.assign(this, init);

    this.downpaymentAmt = this.price * (this.downpaymentPer / 100);
  }

  equal(data2: IOptions): boolean {
    return this.apr === data2.apr && this.downpaymentAmt === data2.downpaymentAmt;
  }
}
