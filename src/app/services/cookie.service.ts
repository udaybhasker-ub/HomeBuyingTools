import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { IOptions } from '../interfaces/IOptions';
import { IAdditionalOptions } from '../interfaces/IAdditionalOptions';
import { Options } from '../objects/Options';

export type AppOptions = {
  options: Options;
  additionalOptions: IAdditionalOptions
}

@Injectable({
  providedIn: 'root'
})
export class AppCookieService {
  cookieName: string = "app-options";

  constructor(private cookieService: CookieService) { }

  saveOptions(appOptions: Options) {
    this.cookieService.set(this.cookieName, JSON.stringify(appOptions));
  }

  getSavedOptions(): Options {
    const val: string = this.cookieService.get(this.cookieName);
    return JSON.parse(val) as Options;
  }
}
