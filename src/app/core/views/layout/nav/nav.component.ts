import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import packageInfo from '../../../../../../package.json';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  frontVersion : string = packageInfo.version;
  backVersion : string = "1.0.0";
  items: MenuItem[];

  constructor(
    public authService: AuthService,
    public dialogService: DialogService,
    public utilsService: UtilsService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {

    this.items = [
      {label: this.translateService.instant('menu.dashboard'), routerLink: '/dashboard', visible: this.authService.hasRole('ADMIN')},
      {label: this.translateService.instant('menu.prompts'), routerLink: '/prompt'},
      {label: this.translateService.instant('menu.chat'), routerLink: '/chat'},
      {label: this.translateService.instant('menu.storage'), routerLink: '/storage'},
      {label: this.translateService.instant('menu.collections'), routerLink: '/collections'},
    ];

    
    this.utilsService.getAppVersion().subscribe((result: any) => {
      this.backVersion = result.version;
    });
    
  }

}
