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
import { TranslateService } from '@ngx-translate/core';

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
    private messageService: MessageService,
    private translateService: TranslateService
  ) {

    this.activatedRoute.data.subscribe((data: any) => { 
      this.prompt = data.prompt;
      this.promptTags = [];

      if (this.prompt != null && this.prompt.tags != null)
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
        this.prompt.id = data;
        this.messageService.add({ severity: 'success', summary: this.translateService.instant('general.saved'), detail: this.translateService.instant('general.save-ok') });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: this.translateService.instant('general.error'), detail: this.translateService.instant('general.save-error') });
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
      else this.suggestionTags = [{code:event.query, name: this.translateService.instant('edit-prompt.add-tag')+event.query}, ...arrayData];
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
      header: this.translateService.instant('edit-prompt.delete-title'),
      message: this.translateService.instant('edit-prompt.delete-content'),
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
      header: this.translateService.instant('import-prompt.title'),
      width: '900px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      modal: true
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


  getTextareaMinHeight(content: string) {
    let lines = content.split('\n').length;
    let height = Math.min(700, Math.max(200, Math.round(lines * 19.5)));


    return height + 'px';
  }
}


