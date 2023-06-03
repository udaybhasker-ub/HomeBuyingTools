import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../services/shared/shared.service';
import { IOptions } from '../interfaces/IOptions';
import { Options } from '../objects/Options';
import { IAdditionalOptions } from '../interfaces/IAdditionalOptions';
import { AppCookieService } from '../services/cookie.service';
import { debounceTime } from 'rxjs/operators';

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
    propertyTaxPer: 2.1,
    homeInsRate: 0.63,
    homeInsAmt: 3150.00,
    pmiRate: 0.75,
    hoaMonthly: 150,
    maintainanceCostMonthly: 250,
    buyerClosingCostsPer: 3.5,
  });
  readonly defaultAdditionalOptions: IAdditionalOptions = {
    rentalAmt: 2400,
    rentalIncreasePer: 3,
    houseValueAppreciationPer: 4,
    sellerClosingCostsPer: 8,
    taxBenifitYearlyAmt: 2500 + 5000,
    avgReturnOnInvestmentPer: 7.0,
    refinanceAfterMonthsCount: 24,
    estimatedRefinanceApr: 5,
  };
  options = this.defaultOptions;
  additionalOptions = this.defaultAdditionalOptions;
  entryForm: FormGroup;
  additionalEntryForm: FormGroup;

  constructor(private sharedService: SharedService, private appCookieService: AppCookieService) {

  }

  ngOnInit(): void {
    try {
      const appOptions = this.appCookieService.getSavedOptions();
      this.updateOptions(appOptions);
    } catch (error) {}
    
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
      } else if (key === "homeInsAmt") {
        val = this.options?.homeInsAmt || this.options.price * (this.options.homeInsRate / 100);
      }
      formGroupOptions[key] = new FormControl(val);
    });
    this.entryForm = new FormGroup(formGroupOptions);

    let addFormGroupOptions = {};
    Object.keys(this.additionalOptions).forEach(key => {
      addFormGroupOptions[key] = new FormControl(this.additionalOptions[key]);
    });
    this.additionalEntryForm = new FormGroup(addFormGroupOptions);
  }

  updateOptions(options: Options) {
    if (options) {
      this.additionalOptions = {...options.additionalOptions};
      delete options['additionalOptions'];
      this.options = {...options, equal: this.options.equal};
    }
  }

  initAddOptionsChangeEvents() {
    this.additionalEntryForm.valueChanges.pipe(debounceTime(500)).subscribe(change => {
      this.onSubmit();
    });
  }
  initOptionsChangeEvents() {
    this.entryForm.get('price')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      let val = change * (this.options.downpaymentPer / 100);
      this.setEntryFormValue('downpaymentAmt', val);

      val = change * (this.options.homeInsRate / 100);
      this.setEntryFormValue('homeInsAmt', val);
    });
    this.entryForm.get('downpaymentPer')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      const val = this.options.price * (parseFloat(change) / 100);
      this.setEntryFormValue('downpaymentAmt', val);
    });
    this.entryForm.get('downpaymentAmt')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      const val = (parseFloat(change) / this.options.price) * 100;
      this.setEntryFormValue('downpaymentPer', val.toFixed(2));
    });
    this.entryForm.get('homeInsRate')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      let val: number = this.options.price * (parseFloat(change) / 100);
      this.setEntryFormValue('homeInsAmt', Math.trunc(val));
    });
    this.entryForm.get('homeInsAmt')?.valueChanges.pipe(debounceTime(500)).subscribe((change: any) => {
      let val: number = (parseFloat(change) / this.options.price) * 100;
      this.setEntryFormValue('homeInsRate', val.toFixed(2));
    });
    this.entryForm.valueChanges.pipe(debounceTime(500)).subscribe((change) => {
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
    this.options.additionalOptions = this.additionalOptions;
    this.sharedService.optionsUpdated.next(this.options);
    try {
      this.appCookieService.saveOptions(this.options);
    } catch (error) {

    }
  }

  setEntryFormValue(arg: string, val: any) {
    const formField = this.entryForm.get(arg);
    formField.setValue(val, { emitEvent: false });
    formField.markAsPristine();
    setTimeout(() => {
      formField.markAsDirty();
    }, 100);
  }
}

