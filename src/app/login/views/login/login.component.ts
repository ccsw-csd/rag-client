import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseCredentials } from 'src/app/core/models/ResponseCredentials';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../services/login.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: string = "";
  password: string = "";
  isloading : boolean = false;

  selectedLanguage : any;
  languages: any[] = [];

  constructor(
    private loginService: LoginService,
    private auth: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private navigatorService: NavigatorService,
    private translateSerive: TranslateService,
  ) { }

  ngOnInit(): void {
    if(this.auth.isTokenValid() && this.auth.getSSOToken() != null){
      this.accessIntoApp();
    }

    this.navigatorService.changeLanguage();

    this.languages = [
      { key: 'general.spanish', flag: 'flag-es', code: 'es' },
      { key: 'general.english', flag: 'flag-uk', code: 'en' }
    ]; 

    let languageCode = this.auth.getLanguage();
    this.selectedLanguage = this.languages.find(x => x.code == languageCode);    
  }

  login() {

    if (this.user == "" || this.password == "") return;
    
    this.isloading = true;
    this.authenticate();
  }

  private authenticate() {

    this.loginService.authenticate(this.user, this.password).subscribe({
      next: (res: ResponseCredentials) => {         
        this.loginService.putSSOCredentials(res);
        this.accessIntoApp();
      },
      error: () => {        
        this.snackbarService.error(this.translateSerive.instant('errors.credentials'));
        this.isloading = false;
      },
    });

  }

  private accessIntoApp() : void {    
    this.isloading = false;

    let roles = this.auth.getRoles();
    if (roles == null || roles.length == 0) {
      this.snackbarService.error(this.translateSerive.instant('not-granted'));
      return;
    }    
    
    this.router.navigate(['main']);
  }

  public getAppCode() : string {
    return environment.appCode;
  }

  onChangeLanguage(language: any) {
    this.selectedLanguage = language;
    let languageCode = language.code;
    this.navigatorService.changeLanguage(languageCode);
  }

}