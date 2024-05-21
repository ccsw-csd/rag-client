import { EventEmitter, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PrimeNGConfig } from "primeng/api";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {

  navchange: EventEmitter<boolean> = new EventEmitter();
  loadchange: EventEmitter<boolean> = new EventEmitter(true);

  private cancelLoading : any = null;

  constructor(
    private translate: TranslateService,
    private primeNGConfig: PrimeNGConfig,
    private authService: AuthService,
  ) {    
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


  changeLanguage(languageCode?: string) {

    if (languageCode == null) {
      languageCode = this.authService.getLanguage();
    }

    this.translate.setDefaultLang(languageCode);
    this.toogleLanguage(languageCode);
    this.authService.setLanguage(languageCode);

  }

  private toogleLanguage(lang: string) {
    this.translate.use(lang);
    this.translate
      .get('primeng')
      .subscribe((res) => this.primeNGConfig.setTranslation(res));
  }

}