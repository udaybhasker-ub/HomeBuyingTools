import { IOptions } from './../interfaces/IOptions';
import { Iinsights } from './../interfaces/Iinsights';
import * as financial from 'financial';
import { CalculatedMonthParams } from '../objects/CalculatedMonthParams';
import { ICalculatedMonthData } from '../interfaces/ICalculatedMonthData';
import { ICalculatedInsights } from '../interfaces/ICalculatedInsights';

export class CalculationUtils {

  static calculateDataMatrix(selectedOptions: IOptions, atMonth?: number): ICalculatedMonthData[] {
    if (!(selectedOptions))
      return undefined;

    const startTime = new Date();

    let calcData: ICalculatedMonthData[] = [];

    const downpayment = (selectedOptions.price && selectedOptions.downpaymentPer > 0 && selectedOptions.price * (selectedOptions.downpaymentPer / 100)) || 0;
    const buyerClosingCost = selectedOptions.price * (selectedOptions.buyerClosingCostsPer / 100);
    const loanAmt = (selectedOptions.price || 0) + buyerClosingCost - downpayment;
    const propertyTax = selectedOptions.propertyTaxPer && selectedOptions.price * (selectedOptions.propertyTaxPer / (12 * 100));
    const homeInsuranceCost = selectedOptions.homeInsAmt && selectedOptions.homeInsAmt / 12;
    const otherCostsNoPMI = (propertyTax || 0) + (homeInsuranceCost || 0) + (selectedOptions.hoaMonthly || 0) + (selectedOptions.maintainanceCostMonthly || 0);

    let cumulative: CalculatedMonthParams = {} as CalculatedMonthParams;
    Object.keys(new CalculatedMonthParams()).forEach((key) => {
      cumulative[key] = key === "loanBalance" ? loanAmt : 0;
    });

    Array.from({ length: atMonth || 1 }, (_, i) => i + 1).forEach(i => {
      cumulative.month = i;
      const apr = selectedOptions.additionalOptions.estimatedRefinanceApr > 0
        && selectedOptions.additionalOptions.refinanceAfterMonthsCount > 0
        && i > selectedOptions.additionalOptions.refinanceAfterMonthsCount
        ? selectedOptions.additionalOptions.estimatedRefinanceApr : selectedOptions.apr;
      const principal = financial.ppmt(apr / (12 * 100), i,
        selectedOptions.loanLength * 12, - loanAmt);

      cumulative.apr = apr;

      cumulative.principal += principal;

      const interest = financial.ipmt(apr / (12 * 100), i,
        selectedOptions.loanLength * 12, - loanAmt);
      cumulative.interest += interest;

      const emi = principal + interest;
      cumulative.emi += emi;

      const loanBalance = cumulative.loanBalance - principal;
      cumulative.loanBalance = loanBalance;

      const mortgageBalance = cumulative.loanBalance - buyerClosingCost;
      const pmi = selectedOptions.pmiRate && (mortgageBalance / selectedOptions.price) > 0.8 ? (loanAmt * (selectedOptions.pmiRate / (12 * 100))) : 0;
      cumulative.pmi += pmi;

      cumulative.propertyTax += propertyTax;

      cumulative.homeInsuranceCost += homeInsuranceCost;

      const hoaMonthly = selectedOptions.hoaMonthly;
      cumulative.hoaMonthly += hoaMonthly;

      const maintainanceCost = selectedOptions.maintainanceCostMonthly;
      cumulative.maintainanceCost += maintainanceCost;

      const otherCosts = otherCostsNoPMI + pmi;
      cumulative.otherCosts += otherCosts;

      const totalCost = emi + otherCosts;
      cumulative.totalCost += totalCost;

      const homeAppreciatedAmt = financial.fv(selectedOptions.additionalOptions.houseValueAppreciationPer / (12 * 100),
        i, 0, -selectedOptions.price);
      const closingCost = homeAppreciatedAmt * (selectedOptions.additionalOptions.sellerClosingCostsPer / 100);

      const taxSavings = selectedOptions.additionalOptions.taxBenifitYearlyAmt / 12;
      cumulative.taxSavings += taxSavings;

      const actualBuyingCost = - (homeAppreciatedAmt - closingCost - selectedOptions.price
        - cumulative.interest - cumulative.otherCosts + cumulative.taxSavings);

      cumulative.actualBuyingCost = actualBuyingCost;

      const actualBuyingCostPerMonthAVG = (actualBuyingCost / i) || 0;

      const rentalCost = financial.fv(selectedOptions.additionalOptions.rentalIncreasePer / 100,
        Math.floor(i / 12), 0, -selectedOptions.additionalOptions.rentalAmt);
      cumulative.rentalCost += rentalCost;

      const buyingVsRentingDiff = - (actualBuyingCostPerMonthAVG - rentalCost);

      cumulative.buyingVsRentingDiff = - (cumulative.actualBuyingCost - cumulative.rentalCost);

      const rentingAvailableCash = downpayment + cumulative.totalCost -
        cumulative.rentalCost - cumulative.taxSavings;
      cumulative.rentingAvailableCash = rentingAvailableCash;

      const oppertunityCost = financial.ipmt(selectedOptions.additionalOptions.avgReturnOnInvestmentPer / (12 * 100),
        1, 1, -rentingAvailableCash);
      cumulative.oppertunityCost += oppertunityCost;

      const nettBuyingVsInvestingDiff = buyingVsRentingDiff - oppertunityCost;
      cumulative.nettBuyingVsInvestingDiff += nettBuyingVsInvestingDiff;

      const atMonth = {
        month: i,
        apr,

        downpayment,
        loanAmt,
        buyerClosingCost,
        hoaMonthly,

        principal,
        interest,
        emi,
        pmi,
        propertyTax,
        homeInsuranceCost,
        maintainanceCost,

        homeAppreciatedAmt,
        closingCost,
        actualBuyingCost,
        actualBuyingCostPerMonthAVG,
        buyingVsRentingDiff,
        rentingAvailableCash,

        loanBalance,
        otherCosts,
        totalCost,
        taxSavings,
        rentalCost,
        oppertunityCost,
        nettBuyingVsInvestingDiff,
      };

      calcData.push({
        atMonth,
        cumulative: {
          ...cumulative, ...{
            downpayment,
            buyerClosingCost,
            loanAmt
          }
        }
      });
    });

    //console.log(calcData);
    return calcData;
  }

  static getInsights(results: ICalculatedMonthData[], selectedOptions: IOptions): Iinsights {
    let atMonthRentingEqualsToBuying = -1;
    let purchaseVsRentBreakEvenMonth = -1;
    let atMonthBuyingCostIsZero = -1;
    let atMonthBuyingIsBenificialThanInvesting = -1;
    let atMonthPMIIsZero = -1;
    let averagePMIAmount = 0;

    results.forEach(month => {
      if (month.atMonth.actualBuyingCostPerMonthAVG <= month.atMonth.rentalCost && atMonthRentingEqualsToBuying < 0) {
        atMonthRentingEqualsToBuying = month.atMonth.month;
      }
      if (month.atMonth.actualBuyingCostPerMonthAVG <= 0 && atMonthBuyingCostIsZero < 0) {
        atMonthBuyingCostIsZero = month.atMonth.month;
      }
      if (month.atMonth.nettBuyingVsInvestingDiff >= 0 && atMonthBuyingIsBenificialThanInvesting < 0) {
        atMonthBuyingIsBenificialThanInvesting = month.atMonth.month;
      }
      if (month.cumulative.buyingVsRentingDiff >= 0 && purchaseVsRentBreakEvenMonth < 0) {
        purchaseVsRentBreakEvenMonth = month.cumulative.month;
      }
      if (month.atMonth.pmi <= 0 && atMonthPMIIsZero < 0) {
        atMonthPMIIsZero = month.atMonth.month;
      }
    });

    let monthCumulativePmiAtEnd = atMonthPMIIsZero > 0 && results[atMonthPMIIsZero - 1];
    averagePMIAmount = (monthCumulativePmiAtEnd && monthCumulativePmiAtEnd.cumulative.pmi / atMonthPMIIsZero) || 0;


    let priceToRentRatio = 0;
    const yearResult = results[11];
    if (yearResult)
      priceToRentRatio = (selectedOptions.price / yearResult.cumulative.rentalCost);

    // PRR = Price / (Rent_Monthly * 12)
    // Price = Rent_Monthly * 12 * PRR;
    // Rent_Monthly = Price / (12 * PRR)

    let idealRentLimitForPrice = 0;
    idealRentLimitForPrice = selectedOptions.price / (12 * 20);

    let idealPriceLimitForRent = 0;
    idealPriceLimitForRent = (selectedOptions.additionalOptions.rentalAmt * 12) * 20;

    return {
      priceToRentRatio,
      idealRentLimitForPrice,
      idealPriceLimitForRent,
      atMonthRentingEqualsToBuying,
      atMonthBuyingCostIsZero,
      atMonthBuyingIsBenificialThanInvesting,
      purchaseVsRentBreakEvenMonth,
      atMonthPMIIsZero,
      averagePMIAmount
    }
  }


  static getInsightMatrix(selectedOptions: IOptions, param: string, step: number, desc: boolean = false): ICalculatedInsights[] {
    let start = selectedOptions[param] - (5 * step);
    start = start || 0;
    let stop = selectedOptions[param] + (5 * step);

    let range: number[] = this.getRange(start, stop, step);
    if (range.findIndex(item => item === selectedOptions[param]) < 0) {
      range.push(selectedOptions[param]);
    }
    range = range.sort((a, b) => desc ? (b - a) : (a - b));

    let results = range.map(val => {
      let options: IOptions = {
        ...selectedOptions, ...{
          [param]: val
        }
      };

      const fullData: ICalculatedMonthData[] = this.calculateDataMatrix(options, options.loanLength * 12);
      const insights: Iinsights = this.getInsights(fullData, options);

      return {
        selectedOptions: options,
        insights
      }
    });
    return results;
  }

  static getRange(start, stop, step): number[] {
    return Array(Math.ceil((stop - start) / step + 1))
      .fill(start)
      .map((x, y) => x + y * step);
  }

  static averageDelta = (array) => {
    let delta = array.reduce(function (r, a, i, aa) {
      i && r.push(a - aa[i - 1]);
      return r;
    }, []);
    const average = delta.reduce(function (a, b) { return a + b; }) / delta.length;
    return average
  }
}
