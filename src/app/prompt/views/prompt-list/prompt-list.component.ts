import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Prompt } from '../../models/Prompt';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { DialogService } from 'primeng/dynamicdialog';
import { PromptViewComponent } from '../prompt-view/prompt-view.component';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-prompt-list',
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class PromptListComponent implements OnInit {

  tableWidth: string;
  prompts: Prompt[] = [];

  constructor(
    private promptService: PromptService,
    private authService: AuthService,
    private navigatorService: NavigatorService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.resizeTable(document.getElementById('p-slideMenu'));

    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      this.resizeTable(menuVisible);
    });

    this.loadData();
  }

  private loadData() : void {

    this.navigatorService.setLoading(true);
    this.promptService.getAll().subscribe((data: Prompt[]) => {
      this.prompts = data;

      this.prompts.forEach((prompt) => {
        prompt.stringTags = prompt.tags.join(', ');
        prompt.author = prompt.person.name + ' ' + prompt.person.lastname;
      });
      
      this.navigatorService.setLoading(false);
    });


  }
 
  isGrantEdit(prompt: Prompt) : boolean {
      let isSameUser = prompt.person.username === this.authService.getUserInfo().username;
      if (isSameUser) {
        return true;
      }

      return this.authService.getRoles().indexOf('ADMIN') >= 0;
  }

  onCreate() : void {
    this.router.navigate(['prompt/edit']);
  }

  onEdit(item: any) : void {
    this.router.navigate(['prompt/edit/'+item.id]);
  }

  onDelete(item: any) : void {

    this.confirmationService.confirm({
      message: 'Si borras este prompt, se eliminará todo rastro de notas personales y posts generados asociados a este prompt.<br/><br/>¿Estás seguro que quieres eliminar el prompt?',
      header: 'Atención, pérdida de datos',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.navigatorService.setLoading(true);
        this.promptService.delete(item.id).subscribe( {
          next: () => {            
            this.loadData();
          },
          error: (err) => {
            this.navigatorService.setLoading(false);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un problema en el borrado. Es posible que no tenga permisos. Contacte con el administrador' });
        }
        });
      },
      reject: () => {

      }
    });


    //this.router.navigate(['prompt/edit/'+item.id]);
  }

  onView(item: any) : void {

    let ref = this.dialogService.open(PromptViewComponent, {
      header: 'Visualizar prompt',
      width: '95vw',
      height: '95vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      data: item
    });

  }
  
  private resizeTable(menuOpened: any) : void {
    if (menuOpened) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      setTimeout(() => {this.tableWidth = 'calc(100vw - 55px)'}, 200);
    }
  }
}
