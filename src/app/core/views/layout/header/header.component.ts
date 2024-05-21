import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserInfoSSO } from 'src/app/core/models/UserInfoSSO';
import { environment } from 'src/environments/environment';
import { ApplicationData } from 'src/app/core/models/ResponseCredentials';
import { NavigatorService } from 'src/app/core/services/navigator.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  applications: ApplicationData[] = [];
  userPicture: string = null;
  user : UserInfoSSO | null = null;
  navOpen = true;
  isloading : boolean = false;
  @Output() navOpenEvent = new EventEmitter();  

  languages: any[] = [];
  selectedLanguage : any;

  constructor(
    public auth: AuthService,
    public dialog: DialogService,
    private navigatorService: NavigatorService,
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getUserInfo();
    this.userPicture = this.auth.getSSOPicture();
    this.applications = this.auth.getApplications().sort((a, b) => a.name.localeCompare(b.name));

    this.languages = [
      { key: 'general.spanish', flag: 'flag-es', code: 'es' },
      { key: 'general.english', flag: 'flag-uk', code: 'en' }
    ];    

    let languageCode = this.auth.getLanguage();
    this.selectedLanguage = this.languages.find(x => x.code == languageCode);
  }


  getAppPicture(application: ApplicationData): string | null {

    if (application == null || application.photo == null) return null;
    return 'data:image/png;base64,'+application.photo;
  }  

  toggleSideNav() {
    this.navOpen = !this.navOpen;
    this.navOpenEvent.emit(this.navOpen);
  }

  getEmail() : string {
    if (this.user == null) return "";
    return this.user.email;
  }  

  getFullName() : string {
    if (this.user == null) return "";
    return this.user.displayName;
  }

  getName() : string {
    if (this.user == null) return "";
    return this.user.firstName;
  }

  logout() {
    this.auth.logout();
  }

  openApp(application: ApplicationData) : void {
    window.open(application.url, "_blank");
  }

  emailRef() {
    window.open("mailto:ccsw.support@%63%61%70%67%65%6D%69%6E%69.%63%6F%6D?subject=["+environment.appCode+"] Feedback");
  }  

  onChangeLanguage(event: any) {
    let languageCode = this.selectedLanguage.code;
    this.navigatorService.changeLanguage(languageCode);
  }

  

}
