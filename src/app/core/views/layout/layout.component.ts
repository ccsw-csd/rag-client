import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavigatorService } from '../../services/navigator.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {

  visibleSideBar = false;
  isLoading : boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private navigatorService : NavigatorService,
    public router: Router
  ) { }

  ngOnInit() {

    this.navigatorService.getLoadingChangeEmitter().subscribe(loading => {
      this.isLoading = loading;
    });
  
    this.authService.registerAccess().subscribe();

    this.activatedRoute.data.subscribe(response => { 
      this.authService.refreshToken(response.credentials);
      //this.loadDetailedUserInfo(response);

    }); 

    this.navigatorService.getNavigatorChangeEmitter().subscribe(visible => {
      this.visibleSideBar = visible;
    });

    this.navigatorService.changeLanguage();
  }

  private loadDetailedUserInfo(response: any) : void {

    //No está activado el userResolver
    if (response == null || Object.keys(response).length == 0) return;

    if (response.user == null) {
      this.authService.logout();
      return;
    }

    this.authService.putUserInfoDetailed(response.user); 
  }

  public toggleMenu() : void {
    //this.visibleSideBar = !this.visibleSideBar;

    this.navigatorService.emitNavigatorChangeEvent(!this.visibleSideBar);
  }

}
