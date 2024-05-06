import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Prompt } from '../../models/Prompt';
import { Post } from '../../models/Post';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PromptImportComponent } from '../prompt-import/prompt-import.component';
import { AutoCompleteCompleteEvent, AutoCompleteOnSelectEvent } from 'primeng/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { Person } from '../../models/Person';

@Component({
  selector: 'app-prompt-edit',
  templateUrl: './prompt-edit.component.html',
  styleUrls: ['./prompt-edit.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class PromptEditComponent implements OnInit {

  prompt: Prompt;
  @ViewChild("contentData") contentData : ElementRef; 


  promptTags: any[] = [];
  suggestionTags: any[] = [];
  

  constructor(
    private promptService: PromptService,    
    private authService: AuthService,    
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {

    this.activatedRoute.data.subscribe((data: any) => { 
      this.prompt = data.prompt;
      this.promptTags = this.prompt.tags.map((tag) => { return {code: tag, name: tag}});
    });
  }


  ngOnInit(): void {

    if (this.prompt) return;

    let userInfo = this.authService.getUserInfo();

    this.prompt = {
      id: null,
      person: {
        username: userInfo.username,
        email: userInfo.email,
        name: userInfo.firstName,
        lastname: userInfo.lastName,
        active: true,
      },
      title: '',
      description: '',
      tags: [],
      posts: []
    }

    this.promptTags = [];
  }


  displayName(person: Person): string{
    return person.name + ' ' + person.lastname;
  }

  convertPlainTextToHtml(text: string): string {
    text = text.replaceAll('<br/>\n', '<br>');
    return text.replace(/\n/g, '<br>');
  }

  onSave() : void {

    this.prompt.tags = [];
    this.promptTags.map((tag) => this.prompt.tags.push(tag.code));

    this.promptService.save(this.prompt).subscribe({
      next: (data) => {
        this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Los datos se han guardado con éxito' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un problema en el guardado. Contacte con el administrador' });
      }
    });
  }

  onSearchTag(event: AutoCompleteCompleteEvent) {

    if (this.promptTags.filter((tag) => tag.code == event.query).length > 0) {
      this.suggestionTags = [];
      return;
    }

    this.promptService.findTags(event.query).subscribe((data) => {

      let filterData = data.filter((tag) => this.promptTags.filter((item)=>item.code == tag).length == 0);
      let arrayData = filterData.map((tag) => { return {code: tag, name: tag}});

      if (data.indexOf(event.query) >= 0) this.suggestionTags = [...arrayData];
      else this.suggestionTags = [{code:event.query, name: 'Añadir Tag: '+event.query}, ...arrayData];
    });
  }



  onChangeType(message: Post, type: string) {
  
    message.type = type;
  
  }



  getAbbreviatedName(name: string): string {
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }


  onAddMessage(index?: number) :void  {
    let type = 'user';

    if (index == undefined) index = this.prompt.posts.length;

    if (index > 0 && this.prompt.posts[index-1] && this.prompt.posts[index-1].type == 'user') {
      type = 'ia';
    }

    let item : Post = {       
      content: '',
      type: type
    };

    this.prompt.posts = [
      ...this.prompt.posts.slice(0, index),
      item,
      ...this.prompt.posts.slice(index)
    ];

  }

  onRemove(index: number) :void  {

    this.confirmationService.confirm({
      message: 'Si eliminas esta sección de información se podrían perder los datos introducidos en esta sección. <br/><br/>¿Estás seguro que deseas eliminarla?',
      header: 'Atención, pérdida de datos',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.prompt.posts.splice(index, 1);
      },
      reject: () => {

      }
    });   
  }

  onImport() :void {

    let ref = this.dialogService.open(PromptImportComponent, {
      header: 'Importar prompt',
      width: '900px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false
    });

    
    ref.onClose.subscribe((result) => {
      if (result.data != undefined) {
        this.prompt.posts.push(...result.data);
      }
    });    
  }

  onClose() {
    this.router.navigate(['prompt']);
  }


}


