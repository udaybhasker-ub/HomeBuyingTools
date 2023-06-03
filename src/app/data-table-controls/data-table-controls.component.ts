import { ChangeContext, LabelType, PointerType } from 'ngx-slider-v2';
import { Component, OnInit } from '@angular/core';
import { ISliderData } from '../interfaces/ISliderData';
import { ISliderOptions } from '../interfaces/ISliderOptions';
import { SharedService } from '../services/shared/shared.service';
@Component({
  selector: 'app-data-table-controls',
  templateUrl: './data-table-controls.component.html',
  styleUrls: ['./data-table-controls.component.less']
})
export class DataTableControlsComponent implements OnInit {
  sliderData: ISliderData = {
    aprData: {
      value: 5,
      highValue: 8,
    },
    dpData: {
      value: 10,
      highValue: 20,
    }
  };
  dpSliderOptions: ISliderOptions = {
    value: this.sliderData.dpData.value,
    highValue: this.sliderData.dpData.highValue,
    options: {
      floor: 1,
      ceil: 25,
      step: 1,
      minRange: 10,
      maxRange: 10,
      showTicks: true,
      draggableRange: true,
      pushRange: true,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value + '%';
          case LabelType.High:
            return value + '%';
          default:
            return value + '%';
        }
      }
    },
  };
  aprSliderOptions: ISliderOptions = {
    value: this.sliderData.aprData.value,
    highValue: this.sliderData.aprData.highValue,
    options: {
      floor: 2,
      ceil: 8,
      step: 0.5,
      minRange: 3,
      maxRange: 3,
      showTicks: true,
      draggableRange: true,
      pushRange: true,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value + '%';
          case LabelType.High:
            return value + '%';
          default:
            return value + '%';
        }
      }
    },
  };



  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.sliderDataUpdated.next(this.sliderData);
  }

  dpChanged(changeContext: ChangeContext) {
    this.sliderData.dpData = {
      value: changeContext.value,
      highValue: changeContext.highValue || 0
    };
    this.sharedService.sliderDataUpdated.next(this.sliderData);
  }

  aprChanged(changeContext: ChangeContext) {
    this.sliderData.aprData = {
      value: changeContext.value,
      highValue: changeContext.highValue || 0
    };
    this.sharedService.sliderDataUpdated.next(this.sliderData);
  }

  getChangeContextString(changeContext: ChangeContext): string {
    return `{pointerType: ${changeContext.pointerType === PointerType.Min ? 'Min' : 'Max'}, ` +
      `value: ${changeContext.value}, ` +
      `highValue: ${changeContext.highValue}}`;
  }
}
