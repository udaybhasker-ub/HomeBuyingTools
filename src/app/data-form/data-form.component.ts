import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';
import { IOptions } from '../interfaces/IOptions';
import { Options } from '../objects/Options';
import { IAdditionalOptions } from '../interfaces/IAdditionalOptions';
import { AppCookieService } from '../services/cookie.service';
import { debounceTime } from 'rxjs/operators';
import { TaxCalculated, TaxOptions } from '../interfaces/tax-options.type';
import { CalculationUtils } from '../utils/CalculationUtils';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.less'],
})
export class DataFormComponent implements OnInit {
  readonly defaultOptions: Options = new Options({
    price: 550000,
    loanLength: 30,
    apr: 6,
    downpaymentPer: 10.0,
    downpaymentAmt: 0,
    propertyTaxPer: 2.4,
    homeInsRate: 0.63,
    pmiRate: 0.75,
    hoaMonthly: 150,
    maintainanceCostPer: 0.6,
    buyerclosingCostPer: 3.5,
  });
  readonly defaultAdditionalOptions: IAdditionalOptions = {
    rentalAmt: 3000,
    rentalIncreasePer: 3,
    houseValueAppreciationPer: 5,
    sellerclosingCostAtSoldsPer: 8,
    taxBenifitYearlyAmt: 3000,
    avgReturnOnInvestmentPer: 7.0,
    refinanceAfterMonthsCount: 24,
    estimatedRefinanceAprChangePercent: 1,
    homeAppraisalToMarketValuePer: 85,
    apply321BuyDown: false,
  };
  readonly defaultTaxOptions: TaxOptions = {
    fitTaxableIncome: 100000,
    childTaxCredit: 1800,
    dependentsCount: 1,
    standardDeduction: 27700,
    stateTaxRate: 0,
    taxBrackets: [{
      min: 0,
      max: 22000,
      rate: 10
    }, {
      min: 22001,
      max: 89450,
      rate: 12
    }, {
      min: 89451,
      max: 190750,
      rate: 22
    }, {
      min: 190751,
      max: 354200,
      rate: 24
    }]
  };
  options = this.defaultOptions;
  additionalOptions = this.defaultAdditionalOptions;
  taxOptions = this.defaultTaxOptions;
  entryForm: FormGroup;
  additionalEntryForm: FormGroup;
  taxOptionsForm: FormGroup;
  taxCalculated: TaxCalculated;

  constructor(private sharedService: SharedService, private appCookieService: AppCookieService) { }

  ngOnInit(): void {
    try {
      const appOptions = this.appCookieService.getSavedOptions();
      this.updateOptions(appOptions);
    } catch (error) { }

    this.updateForms();
    this.initOptionsChangeEvents();
    this.initAddOptionsChangeEvents();

    this.sharedService.defaultOptionsUpdated.subscribe((data: IOptions) => {
      if (!Object.keys(data).length) return;

      Object.keys(data).forEach((key: string) => {
        const formEntry = this.entryForm.get(key);
        if (formEntry) {
          formEntry.setValue(data[key], { emitEvent: false });
        }
      });
      this.onSubmit();
    });

    this.sharedService.resetOptions.subscribe(() => {
      const opt = this.defaultOptions;
      opt.additionalOptions = this.defaultAdditionalOptions;
      opt.taxOptions = this.defaultTaxOptions;
      this.updateOptions(opt);
      this.updateForms();
      this.onSubmit();
    });

    this.onSubmit();
  }

  updateForms() {
    let formGroupOptions = {};
    Object.keys(this.options).forEach(key => {
      let val: number = this.options[key];
      if (key === "downpaymentAmt") {
        val = this.options?.downpaymentAmt || this.options.price * (this.options.downpaymentPer / 100);
      }
      formGroupOptions[key] = new FormControl(val);
    });
    this.entryForm = new FormGroup(formGroupOptions);

    let addFormGroupOptions = {};
    Object.keys(this.additionalOptions).forEach(key => {
      addFormGroupOptions[key] = new FormControl(this.additionalOptions[key]);
    });
    this.additionalEntryForm = new FormGroup(addFormGroupOptions);

    let taxFormGroupOptions = {};
    Object.keys(this.taxOptions).forEach(key => {
      //if (key === 'taxBrackets') return;
      taxFormGroupOptions[key] = new FormControl(this.taxOptions[key]);
    });
    this.taxOptionsForm = new FormGroup(taxFormGroupOptions);
  }

  onTaxBracketChange(taxOptions: TaxOptions) {
    this.taxOptions = { ...taxOptions };
    //this.onSubmit();
    this.options.taxOptions = { ...this.taxOptions };
    this.appCookieService.saveOptions(this.options);
  }

  updateOptions(options: Options) {
    if (options) {
      this.additionalOptions = { ...options.additionalOptions };
      this.taxOptions = { ...options.taxOptions };
      this.options = { ...options, equal: this.options.equal };
    }
  }

  initAddOptionsChangeEvents() {
    this.additionalEntryForm.get('apply321BuyDown')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      this.setAdditionalEntryFormValue('refinanceAfterMonthsCount',
        change ? 0 : this.defaultAdditionalOptions.refinanceAfterMonthsCount);
    });
    this.additionalEntryForm.valueChanges.pipe(debounceTime(500)).subscribe(change => {
      this.onSubmit();
    });
  }
  initOptionsChangeEvents() {
    this.entryForm.get('price')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      let val = change * (this.options.downpaymentPer / 100);
      this.setEntryFormValue('downpaymentAmt', val);
    });
    this.entryForm.get('downpaymentPer')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      const val = this.options.price * (parseFloat(change) / 100);
      this.setEntryFormValue('downpaymentAmt', val);
    });
    this.entryForm.get('downpaymentAmt')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      const val = (parseFloat(change) / this.options.price) * 100;
      this.setEntryFormValue('downpaymentPer', val.toFixed(2));
    });
    this.entryForm.valueChanges.pipe(debounceTime(500)).subscribe((change) => {
      this.onSubmit();
    });

    this.taxOptionsForm.valueChanges.pipe(debounceTime(500)).subscribe((change) => {
      this.onSubmit();
    });
  }

  onSubmit() {
    Object.keys(this.options).forEach((key: string) => {
      this.options[key] = this.entryForm.get(key)?.value;
    });
    Object.keys(this.additionalOptions).forEach((key: string) => {
      this.additionalOptions[key] = this.additionalEntryForm.get(key)?.value;
    });
    Object.keys(this.taxOptions).forEach((key: string) => {
      this.taxOptions[key] = this.taxOptionsForm.get(key)?.value;
    });

    this.options.taxOptions = this.taxOptions;
    this.options.additionalOptions = this.additionalOptions;
    this.taxCalculated = CalculationUtils.calculateFederalTax(this.options, this.taxOptions, 12);
    this.additionalOptions.taxBenifitYearlyAmt = Math.round(this.taxCalculated.taxBenefits);

    this.additionalEntryForm.get('taxBenifitYearlyAmt')?.setValue(this.additionalOptions.taxBenifitYearlyAmt, { emitEvent: false });
    this.sharedService.optionsUpdated.next(this.options);
    try {
      this.appCookieService.saveOptions(this.options);
    } catch (error) { }
  }

  setEntryFormValue(arg: string, val: any) {
    const formField = this.entryForm.get(arg);
    formField.setValue(val, { emitEvent: false });
    formField.markAsPristine();
    setTimeout(() => {
      formField.markAsDirty();
    }, 100);
  }
  setAdditionalEntryFormValue(arg: string, val: any) {
    const formField = this.additionalEntryForm.get(arg);
    formField.setValue(val, { emitEvent: false });
    formField.markAsPristine();
    setTimeout(() => {
      formField.markAsDirty();
    }, 100);
  }
}

