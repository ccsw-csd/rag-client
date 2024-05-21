import { Component, OnInit } from '@angular/core';
import { NavigatorService } from './core/services/navigator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private navigatorService: NavigatorService,
  ) {}


  ngOnInit() {
    this.navigatorService.changeLanguage();
  }

}
