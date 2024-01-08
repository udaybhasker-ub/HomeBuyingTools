import { ICalculatedMonthParams } from "../interfaces/ICalculatedMonthData";

export class MathExpression {
    private expression: string;
    private terms: Record<string, number> = {};

    constructor(expression: string = "", terms: Record<string, number> = {}) {
        this.expression = expression;
        this.terms = terms;
    }

    static add(termName: string, value: number): MathExpression {
        let terms = {};
        terms[termName] = value;
        return new MathExpression(termName, terms);
    }

    add(termName: string, value: number): MathExpression {
        if (!this.terms[termName]) {
            this.terms[termName] = 0;
        }
        this.terms[termName] += value;
        this.expression += ` + ${termName}`;
        return this;
    }

    addExp(expr: MathExpression): MathExpression {
        this.terms = { ...this.terms, ...expr.terms };
        return this;
    }

    subtract(termName: string, value: number): MathExpression {
        if (!this.terms[termName]) {
            this.terms[termName] = 0;
        }
        this.terms[termName] -= value;
        this.expression += ` - ${termName}`;
        return this;
    }

    subtractExp(expr: MathExpression): MathExpression {
        const expTerms = { ...expr.terms };
        Object.keys(expTerms).forEach(key => -expTerms[key]);
        this.terms = { ...this.terms, ...expTerms };
        return this;
    }

    evaluate(): number {
        return Object.values(this.terms).reduce((acc, value) => acc + value, 0);
    }

    toString(): string {
        return this.expression;
    }
}
