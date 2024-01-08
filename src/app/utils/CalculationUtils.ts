import { IOptions } from '../interfaces/IOptions';
import { Iinsights } from '../interfaces/Iinsights';
import * as financial from 'financial';
import { CalculatedMonthParams } from '../objects/CalculatedMonthParams';
import { ICalculatedMonthData } from '../interfaces/ICalculatedMonthData';
import { ICalculatedInsights } from '../interfaces/ICalculatedInsights';
import { TaxCalculated, TaxOptions } from '../interfaces/tax-options.type';

export class CalculationUtils {

  static calculateDataMatrix(selectedOptions: IOptions, atMonth?: number): ICalculatedMonthData[] {
    if (!(selectedOptions))
      return [];

    let calcData: ICalculatedMonthData[] = [];

    const downpayment = (selectedOptions.price && selectedOptions.downpaymentPer > 0 && selectedOptions.price * (selectedOptions.downpaymentPer / 100)) || 0;
    const buyerClosingCost = selectedOptions.price * (selectedOptions.buyerclosingCostPer / 100);
    const loanAmt = (selectedOptions.price || 0) - downpayment;

    let cumulative: CalculatedMonthParams = {} as CalculatedMonthParams;
    Object.keys(new CalculatedMonthParams()).forEach((key) => {
      let val = 0;
      if (key === 'loanBalance') {
        val = loanAmt;
      } else if (key === 'cashAvailableForInvesting') {
        val = downpayment + buyerClosingCost;
      }
      cumulative[key] = val;
    });

    let prevYrValues = {
      propertyTax: -1,
      homeInsuranceCost: -1,
      maintainanceCost: -1
    };
    Array.from({ length: atMonth || 1 }, (_, i) => i + 1).forEach(i => {
      cumulative.month = i;
      const year = CalculationUtils.getYearFromMonth(i);
      let apr = selectedOptions.apr;
      if (selectedOptions.additionalOptions.apply321BuyDown) {
        if (year <= 3) {
          apr += year - 4;
          if (apr < 1) {
            apr = 1;
          }
        }
      } else if (selectedOptions.additionalOptions.estimatedRefinanceAprChangePercent > 0
        && selectedOptions.additionalOptions.refinanceAfterMonthsCount > 0
        && i > selectedOptions.additionalOptions.refinanceAfterMonthsCount) {
        apr = selectedOptions.apr - selectedOptions.additionalOptions.estimatedRefinanceAprChangePercent;
      }

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

      const pmi = selectedOptions.pmiRate && (cumulative.loanBalance / selectedOptions.price) > 0.8 ? (loanAmt * (selectedOptions.pmiRate / (12 * 100))) : 0;
      cumulative.pmi += pmi;

      const homeValueAppreciatedAmt = financial.fv(selectedOptions.additionalOptions.houseValueAppreciationPer / (12 * 100),
        i, 0, -selectedOptions.price);
      const equity = homeValueAppreciatedAmt - (cumulative.homeValueAppreciatedAmt > 0 ? cumulative.homeValueAppreciatedAmt : selectedOptions.price);
      cumulative.homeValueAppreciatedAmt = homeValueAppreciatedAmt;
      cumulative.equity += equity;

      // Calculate on yearly basis based on the appreciated amount
      let homeInsuranceCost = 0;
      if ((i % 12) === 1 || prevYrValues?.homeInsuranceCost < 0) {
        homeInsuranceCost = selectedOptions.homeInsRate && homeValueAppreciatedAmt * (selectedOptions.homeInsRate / (12 * 100));
        prevYrValues.homeInsuranceCost = homeInsuranceCost;
      } else {
        homeInsuranceCost = prevYrValues.homeInsuranceCost;
      }
      cumulative.homeInsuranceCost += homeInsuranceCost;

      // Calculate on yearly basis
      let propertyTax = 0;
      if ((i % 12) === 1 || prevYrValues?.propertyTax < 0) {
        propertyTax = selectedOptions.propertyTaxPer && homeValueAppreciatedAmt * (selectedOptions.additionalOptions.homeAppraisalToMarketValuePer / 100) * (selectedOptions.propertyTaxPer / (12 * 100));
        prevYrValues.propertyTax = propertyTax;
      } else {
        propertyTax = prevYrValues.propertyTax;
      }
      cumulative.propertyTax += propertyTax;

      // Calculate on yearly basis
      let maintainanceCost = 0;
      if ((i % 12) === 1 || prevYrValues?.maintainanceCost < 0) {
        maintainanceCost = selectedOptions.maintainanceCostPer && homeValueAppreciatedAmt * (selectedOptions.maintainanceCostPer / (12 * 100));
        prevYrValues.maintainanceCost = maintainanceCost;
      } else {
        maintainanceCost = prevYrValues.maintainanceCost;
      }
      cumulative.maintainanceCost += maintainanceCost;

      const hoaMonthly = selectedOptions.hoaMonthly;
      cumulative.hoaMonthly += hoaMonthly;

      const otherCosts = pmi + (propertyTax || 0) + (homeInsuranceCost || 0) + (hoaMonthly || 0) + (maintainanceCost || 0);
      cumulative.otherCosts += otherCosts;

      const taxSavings = selectedOptions.additionalOptions.taxBenifitYearlyAmt / 12;
      cumulative.taxSavings += taxSavings;

      const totalMonthlyPayment = emi + otherCosts - taxSavings;
      cumulative.totalMonthlyPayment += totalMonthlyPayment;

      const closingCostAtSold = homeValueAppreciatedAmt * (selectedOptions.additionalOptions.sellerclosingCostAtSoldsPer / 100);
      cumulative.closingCostAtSold = closingCostAtSold;

      const totalBuyingCost = downpayment + buyerClosingCost + cumulative.totalMonthlyPayment;
      cumulative.totalBuyingCost = totalBuyingCost;

      const netBuyingCost = selectedOptions.price + downpayment + buyerClosingCost + closingCostAtSold
        + cumulative.totalMonthlyPayment - homeValueAppreciatedAmt;
      cumulative.netBuyingCost = netBuyingCost;

      const netBuyingCostPerMonthAVG = (netBuyingCost / i) || 0;

      const rentalCost = financial.fv(selectedOptions.additionalOptions.rentalIncreasePer / 100,
        Math.floor(i / 12), 0, -selectedOptions.additionalOptions.rentalAmt);
      cumulative.rentalCost += rentalCost;

      let cashAvailableForInvesting = totalMonthlyPayment - rentalCost;
      cashAvailableForInvesting = cashAvailableForInvesting > 0 ? cashAvailableForInvesting : 0;
      cumulative.cashAvailableForInvesting += cashAvailableForInvesting;

      const returnOnInvestment = financial.ipmt(selectedOptions.additionalOptions.avgReturnOnInvestmentPer / (12 * 100),
        1, 1, -cumulative.cashAvailableForInvesting);

      cumulative.returnOnInvestment += returnOnInvestment;

      const netRentalCost = rentalCost - returnOnInvestment;
      cumulative.netRentalCost += netRentalCost;

      const netInvestingToBuyingDifference = netBuyingCostPerMonthAVG - netRentalCost;
      cumulative.netInvestingToBuyingDifference = cumulative.netBuyingCost - cumulative.netRentalCost;

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

        homeValueAppreciatedAmt,
        equity,
        closingCostAtSold,
        totalBuyingCost,
        netBuyingCost,
        netBuyingCostPerMonthAVG,
        cashAvailableForInvesting,

        loanBalance,
        otherCosts,
        totalMonthlyPayment,
        taxSavings,
        rentalCost,
        returnOnInvestment,
        netRentalCost,
        netInvestingToBuyingDifference,
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

    return calcData;
  }

  static calculateFederalTax(selectedOptions: IOptions, taxOptions: TaxOptions, month: number): TaxCalculated {
    const saltLimit = 10000;
    const stateTaxAmount = taxOptions.stateTaxRate * taxOptions.fitTaxableIncome;
    const childTaxCreditAmount = taxOptions.childTaxCredit * taxOptions.dependentsCount;
    const data: ICalculatedMonthData[] = this.calculateDataMatrix(selectedOptions, month);
    const atYearEnd = data[data.length - 1];
    const saltTaxAmount = Math.min(atYearEnd.cumulative.propertyTax + stateTaxAmount, saltLimit);
    const homeDeductionTotal = atYearEnd.cumulative.interest + saltTaxAmount;
    const taxableIncome = taxOptions.fitTaxableIncome - Math.max(taxOptions.standardDeduction, homeDeductionTotal);

    const taxesBeforeCredits = this.calculateFedTax(taxOptions, taxableIncome);
    const netFederalTax = taxesBeforeCredits - childTaxCreditAmount;

    const nonHomeOwnerDeductionTotal = Math.min(stateTaxAmount, saltLimit);
    const nonHomeOwnerTaxableIncome = taxOptions.fitTaxableIncome - Math.max(taxOptions.standardDeduction, nonHomeOwnerDeductionTotal);
    const nonHomeOwnerTaxesBeforeCredits = this.calculateFedTax(taxOptions, nonHomeOwnerTaxableIncome);
    const nonHomeOwnerNetFederalTax = nonHomeOwnerTaxesBeforeCredits - childTaxCreditAmount;

    const taxBenefits = nonHomeOwnerNetFederalTax - netFederalTax;

    return {
      fitTaxableIncome: taxOptions.fitTaxableIncome,
      childTaxCreditAmount,
      standardDeductionAmount: taxOptions.standardDeduction,
      stateTaxAmount,
      mortgageInterestDeduction: atYearEnd.cumulative.interest,
      propertyTaxDeduction: atYearEnd.cumulative.propertyTax,
      homeDeductionTotal,
      saltTaxAmount,
      taxableIncome,
      taxesBeforeCredits,
      netFederalTax,
      taxBenefits
    }
  }

  private static calculateFedTax(taxOptions: TaxOptions, taxableIncome: number) {
    let taxesBeforeCredits = 0;
    for (let i = 0; i < taxOptions.taxBrackets.length; i++) {
      const lowerBound = i === 0 ? 0 : taxOptions.taxBrackets[i - 1].max;
      const upperBound = taxOptions.taxBrackets[i].max;
      const incomeInBracket = Math.min(taxableIncome, upperBound) - lowerBound;

      if (incomeInBracket <= 0) {
        break;
      }

      const taxRate = taxOptions.taxBrackets[i].rate / 100;
      const bracketTax = incomeInBracket * taxRate;
      taxesBeforeCredits += bracketTax;
    }
    return taxesBeforeCredits;
  }

  static getInsights(results: ICalculatedMonthData[], selectedOptions: IOptions): Iinsights {
    let atMonthRentingEqualsToBuying = -1;
    let purchaseVsRentBreakEvenMonth = -1;
    let atMonthBuyingCostIsZero = -1;
    let atMonthBuyingIsBenificialThanInvesting = -1;
    let atMonthPMIIsZero = -1;
    let averagePMIAmount = 0;

    results.forEach(month => {
      if (month.atMonth.netBuyingCostPerMonthAVG <= month.atMonth.rentalCost && atMonthRentingEqualsToBuying < 0) {
        atMonthRentingEqualsToBuying = month.atMonth.month;
      }
      if (month.atMonth.netBuyingCostPerMonthAVG <= 0 && atMonthBuyingCostIsZero < 0) {
        atMonthBuyingCostIsZero = month.atMonth.month;
      }
      if (month.cumulative.netInvestingToBuyingDifference <= 0 && atMonthBuyingIsBenificialThanInvesting < 0) {
        atMonthBuyingIsBenificialThanInvesting = month.atMonth.month;
      }
      if (month.cumulative.netInvestingToBuyingDifference <= 0 && purchaseVsRentBreakEvenMonth < 0) {
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

  private static getYearFromMonth(monthNumber: number): number {
    if (monthNumber < 1 || monthNumber > 360) {
      throw new Error("Month number must be between 1 and 360");
    }

    // Assuming month 1 is January of Year 1
    const baseYear = 1;
    const year = Math.ceil(monthNumber / 12);

    return baseYear + year - 1;
  }
}
