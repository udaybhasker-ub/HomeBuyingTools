import * as financial from 'financial';
import { IOptions } from "../interfaces/IOptions";
import { MathExpression } from "../objects/math-expresson";
import { nameof } from "./common-utils";

export class ExpressionCalculator {
    selectedOptions: IOptions;
    atMonth: number;
    cumulative = false;

    constructor(selectedOptions: IOptions, atMonth: number, cumulative: boolean = false) {
        this.selectedOptions = selectedOptions;
        this.atMonth = atMonth;
        this.cumulative = cumulative;
    }

    downpayment(): MathExpression {
        return MathExpression.add('downpayment',
            (this.selectedOptions.price && this.selectedOptions.downpaymentPer > 0
                && this.selectedOptions.price * (this.selectedOptions.downpaymentPer / 100)) || 0);
    }

    buyerClosingCost() {
        return MathExpression.add('buyerClosingCost',
            this.selectedOptions.price * (this.selectedOptions.buyerclosingCostPer / 100));
    }

    loanAmount(): MathExpression {
        return new MathExpression('loanAmount')
            .add('price', this.selectedOptions.price || 0)
            .subtractExp(this.downpayment());
    }

    propertyTax(): MathExpression {
        const propertyTax = this.computeVal(() => this.selectedOptions.propertyTaxPer
            && this.selectedOptions.price * (this.selectedOptions.propertyTaxPer / (12 * 100)));

        return MathExpression.add('propertyTax', propertyTax);
    }

    homeInsuranceCost(): MathExpression {
        return MathExpression.add('homeInsuranceCost', this.computeVal(() => this.selectedOptions.price * (this.selectedOptions.homeInsRate / (12 * 100))));
    }

    hoaMonthlyCost(): MathExpression {
        return MathExpression.add('hoaMonthly', this.computeVal(() => this.selectedOptions.hoaMonthly));
    }

    maintainanceCost(): MathExpression {
        return MathExpression.add('maintainanceCost', this.computeVal(() => this.selectedOptions.price * (this.selectedOptions.maintainanceCostPer / (12 * 100))));
    }

    otherCosts(): MathExpression {
        return new MathExpression('otherCosts')
            .addExp(this.pmi())
            .addExp(this.propertyTax())
            .addExp(this.homeInsuranceCost())
            .add('hoaMonthly', this.selectedOptions.hoaMonthly)
            .addExp(this.maintainanceCost());
    }

    apr(): MathExpression {
        let refinanceAprPer = this.selectedOptions.apr * (1 - (this.selectedOptions.additionalOptions.estimatedRefinanceAprChangePercent / 100));
        refinanceAprPer = Math.round(refinanceAprPer * 4) / 4;

        const apr = refinanceAprPer > 0
            && this.selectedOptions.additionalOptions.refinanceAfterMonthsCount > 0
            && this.atMonth > this.selectedOptions.additionalOptions.refinanceAfterMonthsCount
            ? refinanceAprPer : this.selectedOptions.apr;

        return MathExpression.add('apr', apr);
    }

    principal(): MathExpression {
        let p = this.computeVal((month) =>
            financial.ppmt(this.apr().evaluate() / (12 * 100), month,
                this.selectedOptions.loanLength * 12, -this.loanAmount().evaluate()));
        //console.log('principal=' + p);
        return MathExpression.add('principal', p);
    }

    interest(): MathExpression {
        let interest = this.computeVal((month) =>
            financial.ipmt(this.apr().evaluate() / (12 * 100), month,
                this.selectedOptions.loanLength * 12, -this.loanAmount().evaluate()));

        return MathExpression.add('interest', interest);
    }

    emi(): MathExpression {
        return new MathExpression('emi')
            .addExp(this.principal())
            .addExp(this.interest());
    }

    loanBalance(): MathExpression {
        return MathExpression
            .add('loanAmount', this.loanAmount().evaluate())
            .subtractExp(this.principal());
    }

    pmi(): MathExpression {
        let pmi = this.computeVal((month) =>
            this.selectedOptions.pmiRate
                && (this.loanBalance().evaluate() / this.selectedOptions.price) > 0.8
                ? (this.loanAmount().evaluate() * (this.selectedOptions.pmiRate / (12 * 100))) : 0);

        return MathExpression.add('pmi', pmi);
    }

    totalMonthlyPayment(): MathExpression {
        const totalMonthlyPayment = new MathExpression('totalMonthlyPayment')
            .addExp(this.emi())
            .addExp(this.otherCosts());
        return totalMonthlyPayment;
    }

    homeValueAppreciatedAmt(): MathExpression {
        const homeValueAppreciatedAmt = financial.fv(this.selectedOptions.additionalOptions.houseValueAppreciationPer / (12 * 100),
            this.atMonth, 0, -this.selectedOptions.price);
        return MathExpression.add('homeValueAppreciatedAmt', homeValueAppreciatedAmt);
    }

    equity(): MathExpression {
        return new MathExpression('equity')
            .addExp(this.homeValueAppreciatedAmt())
            .subtract('price', this.selectedOptions.price);
    }

    closingCostAtSold(): MathExpression {
        return MathExpression.add('closingCostAtSold',
            this.homeValueAppreciatedAmt().evaluate() * (this.selectedOptions.additionalOptions.sellerclosingCostAtSoldsPer / 100));
    }

    taxSavings(): MathExpression {
        return MathExpression.add('taxSavings', this.computeVal(() => this.selectedOptions.additionalOptions.taxBenifitYearlyAmt / 12));
    }

    totalBuyingCost(): MathExpression {
        return new MathExpression('totalBuyingCost')
            .addExp(this.downpayment())
            .addExp(this.buyerClosingCost())
            .addExp(this.totalMonthlyPayment());
    }

    netBuyingCost(): MathExpression {
        return new MathExpression('netBuyingCost')
            .add('price', this.selectedOptions.price)
            .addExp(this.closingCostAtSold())
            .addExp(this.downpayment())
            .addExp(this.buyerClosingCost())
            .addExp(this.totalMonthlyPayment())
            .subtractExp(this.homeValueAppreciatedAmt())
            .subtractExp(this.taxSavings());
    }

    rentalCost(): MathExpression {
        const rentalCost = this.computeVal((month) => financial.fv(this.selectedOptions.additionalOptions.rentalIncreasePer / 100,
            Math.floor(month / 12), 0, -this.selectedOptions.additionalOptions.rentalAmt));
        return MathExpression.add('rentalCost', rentalCost);
    }

    cashAvailableForInvesting(): MathExpression {
        let cash = new MathExpression('cashAvailableForInvesting');
        if (this.cumulative) {
            cash.addExp(this.downpayment()).addExp(this.buyerClosingCost())
        }
        return cash.add('totalMonthlyPayment', this.totalMonthlyPayment().evaluate())
            .subtractExp(this.rentalCost())
            .subtractExp(this.taxSavings());
    }

    returnOnInvestment(): MathExpression {
        const returnOnInvestment = this.computeVal((month) => financial.fv(this.selectedOptions.additionalOptions.avgReturnOnInvestmentPer / (12 * 100),
            month, 0, -this.selectedOptions.additionalOptions.rentalAmt));

        return MathExpression.add('returnOnInvestment', returnOnInvestment);
    }

    netRentalCost(): MathExpression {
        return new MathExpression('netRentalCost')
            .addExp(this.rentalCost())
            .subtractExp(this.returnOnInvestment());
    }

    netInvestingToBuyingDifference(): MathExpression {
        var netBuyingCost = this.netBuyingCost().evaluate();
        if (!this.cumulative) {
            netBuyingCost /= this.atMonth;
        }
        return new MathExpression('netInvestingToBuyingDifference')
            .add('netBuyingCostPerMonthAVG', netBuyingCost)
            .subtractExp(this.netRentalCost());
    }

    private computeVal(fn: (month: number) => number, forceCumulative: boolean = false) {
        let val = 0;
        let months = forceCumulative || this.cumulative ? Array.from({ length: this.atMonth }, (_, i) => this.atMonth - i) : [this.atMonth];
        months.forEach(month => {
            val += fn(month);
            return val;
        });
        return val;
    }
}