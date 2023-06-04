import { TaxBracket } from "./tax-bracket.type";

export type TaxOptions = {
    fitTaxableIncome: number;
    childTaxCredit: number;
    dependentsCount: number;
    standardDeduction: number;
    stateTaxRate: number;
    taxBrackets: TaxBracket[];
}

export type TaxCalculated = {
    fitTaxableIncome: number;
    childTaxCreditAmount: number;
    standardDeductionAmount: number;
    stateTaxAmount: number;
    mortgageInterestDeduction: number;
    mortgageInsuranceDeduction: number;
    propertyTaxDeduction: number;
    homeDeductionTotal: number;
    saltTaxAmount: number;
    taxableIncome: number;
    taxesBeforeCredits: number;
    netFederalTax: number;
    taxBenifits: number;
}