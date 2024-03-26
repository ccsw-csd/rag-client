import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from 'primeng/dynamicdialog';
import { UserInfoSSO } from 'src/app/core/models/UserInfoSSO';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userPicture: string = null;
  user : UserInfoSSO | null = null;
  navOpen = true;
  isloading : boolean = false;
  @Output() navOpenEvent = new EventEmitter();

  constructor(
    public auth: AuthService,
    public dialog: DialogService
  ) { }

  ngOnInit(): void {
    this.user = this.auth.getUserInfo();
    this.userPicture = this.auth.getSSOPicture();
  }

  toggleSideNav() {
    this.navOpen = !this.navOpen;
    this.navOpenEvent.emit(this.navOpen);
  }

  getEmail() : string {
    if (this.user == null) return "";
    return this.user.email;
  }  

  getName() : string {
    if (this.user == null) return "";
    return this.user.displayName;
  }

  logout() {
    this.auth.logout();
  }

  apps() : void {
    window.open('https://cca.'+this.getDomain()+'.com'+environment.ssoApp, "_blank");
  }

  getDomain() : string {
    let gitWord2 = "pge";
    let gitWord4 = "i";
    let gitWord3 = "min";
    let gitWord1 = "ca";

    let gitWord = gitWord1+gitWord2+gitWord3+gitWord4;

    return gitWord;
  }

  emailRef() {
    window.open("mailto:ccsw.support@"+this.getDomain()+".com?subject=["+environment.appCode+"] Consulta / Feedback");
  }  

}
