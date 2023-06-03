import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared/shared.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.less']
})
export class AppHeaderComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  onResetOptions(event: Event) {
    this.sharedService.resetOptions.next(true);
  }

}
