import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  navchange: EventEmitter<boolean> = new EventEmitter();
  loadchange: EventEmitter<boolean> = new EventEmitter(true);

  private cancelLoading : any = null;

  constructor() {    
  }

  emitNavigatorChangeEvent(toogleMenu: boolean) {
    this.navchange.emit(toogleMenu);
  }

  getNavivagorChangeEmitter() {
    return this.navchange;
  }

  getLoadingChangeEmitter() {
    return this.loadchange;
  }

  setLoading(isLoading: boolean) {
    this.loadchange.emit(isLoading);

    if (isLoading) {
      if (this.cancelLoading != null) clearTimeout(this.cancelLoading);

      this.cancelLoading = setTimeout(() => this.setLoading(false), 60000);
    }
    else if (this.cancelLoading != null) clearTimeout(this.cancelLoading);
  }


}