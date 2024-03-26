import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  navchange: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  emitNavigatorChangeEvent(toogleMenu: boolean) {
    this.navchange.emit(toogleMenu);
  }

  getNavivagorChangeEmitter() {
    return this.navchange;
  }
}