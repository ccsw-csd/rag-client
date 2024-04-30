import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ChatService } from 'src/app/chat/services/chat.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Prompt } from '../../models/Prompt';
import { Post } from '../../models/Post';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { PromptImportComponent } from '../prompt-import/prompt-import.component';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-prompt-view',
  templateUrl: './prompt-view.component.html',
  styleUrls: ['./prompt-view.component.scss'],
  providers: [DialogService]
})
export class PromptViewComponent implements OnInit {

  prompt: Prompt;
 
  @ViewChild("contentData") contentData : ElementRef; 


  suggestionTags: any[] = [];
  

  constructor(
    private navigatorService: NavigatorService,
    private authService: AuthService,    
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
  ) {
  }


  ngOnInit(): void {


    this.prompt = {
      id: 1,
      person: {
        id: 1,
        username: 'pajimene',
        firstName: 'Pablo',
        lastName: 'Jiménez Martínez',
        displayName: 'Pablo Jiménez Martínez',
        email: 'pajimene@capgemini.com',
        officeName: 'Valencia'
      },
      title: 'Prompt de prueba extraido de ChatGPT',
      description: 'Este es un prompt de ejemplo directamente importado de ChatGPT.\nLo utilicé para montar el GenAI challenge nº3 de Capgemini',
      tags: ['cobol', 'challengeIA', 'Capgemini'],
      posts: []
    }
  }


  onSearch(event: AutoCompleteCompleteEvent) {
    this.suggestionTags = [...Array(10).keys()].map(item => event.query + '-' + item);
  }


  onChangeType(message: Post, type: string) {
  
    message.type = type;

    if (type == 'ia') message.author = 'Assistant';
    else message.author = this.authService.getUserInfo().displayName;
  
  }



  getAbbreviatedName(name: string): string {
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }


  onAddMessage(index?: number) :void  {
    let type = 'user';

    if (index > 0 && this.prompt.posts[index-1] && this.prompt.posts[index-1].type == 'user') {
      type = 'ia';
    }

    let item : Post = {       
      author: '',
      content: '',
      type: type
    };


    if (type == 'ia') item.author = 'Assistant';
    else item.author = this.authService.getUserInfo().displayName;



    if (index == undefined) {
      this.prompt.posts.push(item);
    }
    else {    
      this.prompt.posts = [
        ...this.prompt.posts.slice(0, index),
        item,
        ...this.prompt.posts.slice(index)
      ];
    }

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

}


