import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IOptions } from '../../interfaces/IOptions';
import { ISliderData } from '../../interfaces/ISliderData';
import { IAdditionalOptions } from '../../interfaces/IAdditionalOptions';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  optionsUpdated: BehaviorSubject<IOptions> = new BehaviorSubject<IOptions>({} as any);
  sliderDataUpdated: BehaviorSubject<ISliderData> = new BehaviorSubject<ISliderData>({} as any);
  defaultOptionsUpdated: BehaviorSubject<IOptions> = new BehaviorSubject<IOptions>({} as any);
  updateNavOptions: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);
  changeNavOptions: BehaviorSubject<any> = new BehaviorSubject<any>({} as any);
  resetOptions: Subject<boolean> = new Subject();

  addToCompare: BehaviorSubject<IOptions> = new BehaviorSubject<IOptions>({} as any);
  removeFromCompare: BehaviorSubject<IOptions> = new BehaviorSubject<IOptions>({} as any);

  updateSelections: BehaviorSubject<IOptions[]> = new BehaviorSubject<IOptions[]>({} as any);

  constructor() { }
}
