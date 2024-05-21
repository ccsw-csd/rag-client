import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../model/Message';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatService } from '../../services/chat.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ChatInfoComponent } from '../chat-info/chat-info.component';
import { Collection } from 'src/app/collection/models/Collection';
import { CollectionService } from 'src/app/collection/services/collection.service';
import { DocumentService } from 'src/app/storage/services/document.service';
import { DocumentFile } from 'src/app/storage/model/DocumentFile';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Chat } from '../../model/Chat';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [DialogService]
})
export class ChatComponent implements OnInit {

  @ViewChild('assistantPanel') assistantPanel: OverlayPanel;  
  @ViewChild('divMessages') comment: ElementRef;  
  

  chats: Chat[] = [];
  selectedChat: Chat = null;

  scrolltop: number = null;

  questionArea: number = 50;
  documents: DocumentFile[] = [];

  messages: Message[];
  question: string = '@noAutocontext @file(*Entity.java) Dame el código SQL de creación de la BBDD para MySQL';
  asking: boolean = false;

  collections : Collection[];
  selectedCollection : Collection;

  assistantContent: string = '';

  assistantAnottations: any[] = [];

  generalAnnotations: any[] = [
    {key: '@noAutocontext', value: 'No genera contexto automático para la IA'},
    {key: '@onlyDoc', value: 'Genera el contexto automático solamente con documentación'},
    {key: '@onlyCode', value: 'Genera el contexto automático solamente con código fuente'},
    {key: '@file(regex)', value: 'Añade un fichero al contexto de forma manual'},
    {key: '@query', value: 'La respuesta de la IA será una query SQL'},
  ];
  
  constructor(
    private navigatorService: NavigatorService,
    private authService: AuthService,
    private chatService: ChatService,
    private dialogService: DialogService,
    private collectionService: CollectionService,
    private documentService: DocumentService,
  ) {
  }
  
  
  ngOnInit(): void {
    this.navigatorService.setLoading(true);
    this.collectionService.findAll().subscribe(collections => {
      
      
      this.collections = collections;
      let selectedCollection = this.authService.getProperty("selected-collection");
      
      if (selectedCollection == null) {
        this.selectedCollection = collections[0];
        this.authService.setProperty("selected-collection", this.selectedCollection);
      }
      else {
        this.selectedCollection = selectedCollection;
      }
      
      this.onWriteQuestion(null);
      this.loadConfig();
    });

  }

  loadConfig() : void {

    this.navigatorService.setLoading(true);
    this.messages = [];

    this.chatService.getChats(this.selectedCollection.id).subscribe(chats => {
      this.chats = chats;

      this.navigatorService.setLoading(false);
    });


    /*
    this.documentService.getDocumentsByCollectionId(this.selectedCollection.id).subscribe(
      documents => {

        this.documents = documents;
    });
    */

    
  }


  onButtonInfo(message: Message) : void {

    let index = this.messages.indexOf(message);

    let ref = this.dialogService.open(ChatInfoComponent, {
      header: 'Información del mensaje',
      width: '75vw',
      height: '75vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      data: { message: message, messagePrevious: index > 0 ? this.messages[index-1] : null}
    });

    /*
    ref.onClose.subscribe((result) => {
      if (result.toRefresh) {
        this.navigatorService.setLoading(true);
        this.loadDocuments();
      }
    });    
    */


  }


  onQuestionSend() : void {
    
    let textQuestion = this.question;
    this.question = '';
    
    if (textQuestion != null && textQuestion.length > 0) {

      let collectionId = this.selectedCollection.id;
      this.asking = true;

      this.messages.push({
        id: null,
        user: true, 
        author: this.authService.getUserInfo().firstName+' '+this.authService.getUserInfo().lastName,
        content: textQuestion,
        date: new Date()
      });
      
      this.calculateScroll();

      if (this.selectedChat == null) {

        this.chatService.createChats(collectionId, textQuestion).subscribe( chat => {
          this.selectedChat = chat;

          this.chats = [chat, ...this.chats];

          this.chatService.sendMessage(this.selectedChat.id, textQuestion).subscribe({
            next: res => {
              this.messages.push(res);
              this.asking = false;
              this.calculateScroll();
            },
            error: err => {
              console.error(err);
            }
          });    
        });
      }

      else {
        this.chatService.sendMessage(this.selectedChat.id, textQuestion).subscribe({
          next: res => {
            this.messages.push(res);
            this.asking = false;
            this.calculateScroll();
          },
          error: err => {
            console.error(err);
          }
        });
      }


    }


  }


  getAbbreviatedName(name: string): string {
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }

  onChangeCollection(event) : void {
    this.authService.setProperty("selected-collection", this.selectedCollection);
    this.loadConfig();
  }

  lastControlKeyTime: number = 0;

  onWriteQuestion(event: KeyboardEvent) : void {
        
    if (event != null) {

      let textarea : any = document.getElementById('question');
      let caretPosition = textarea.selectionStart - 1;


      if (event.key == 'Control') {
        this.lastControlKeyTime = event.timeStamp;
        return;
      }

      
      else if ((event.code == 'Enter' && event.ctrlKey) || (event.code == 'Enter' && event.timeStamp - this.lastControlKeyTime < 100)) {
        this.assistantPanel.hide();
        this.onQuestionSend();
        return;
      }
      
      else if (event.code == 'Enter' && this.assistantPanel.overlayVisible == true && this.assistantAnottations.length > 0) {
        this.onAnnotationClick(this.assistantAnottations[0]);
      }

      else if (this.question.charAt(caretPosition) == '@' && this.assistantPanel.overlayVisible == false) {
        this.generateAssistantContent('@');
        this.assistantPanel.toggle(event, null);
        this.calculateAssistantPosition(250);
      }

      else if (event.code == 'Space' && this.assistantPanel.overlayVisible == true) {
        this.assistantPanel.hide();  
      }

      else if ((event.code == 'Space' && event.ctrlKey) || (event.code == 'Space' && event.timeStamp - this.lastControlKeyTime < 100)) {
        this.generateAssistantContent(null);
        this.assistantPanel.toggle(event, null);
        this.calculateAssistantPosition(250);
      }
      
      if (this.assistantPanel.overlayVisible) {
        let textarea : any = document.getElementById('question');
        let caretPosition = textarea.selectionStart - 1;
        
        let annotation = '';

        let lastSpace = Math.max(0, this.question.lastIndexOf(' ', caretPosition));
        let annotationStart = Math.max(lastSpace, this.question.lastIndexOf('@', caretPosition)-1);
  
        if (annotationStart >= 0 && caretPosition > annotationStart) {
          annotation = this.question.substring(annotationStart, caretPosition+1).trim();
        } 
  
        this.generateAssistantContent(annotation);
        this.calculateAssistantPosition();
      }

    }


    let text = this.question+' ';

    let numberOfLines = text.split('\n').length;
    if (numberOfLines > 10) numberOfLines = 10;
    if (numberOfLines < 1) numberOfLines = 1;

    this.questionArea = 30 + numberOfLines * 20;
  }

  calculateAssistantPosition(time?: number) {
    if (!time) time = 1;

    setTimeout(() => {
      let panel : any = document.getElementsByClassName('p-overlaypanel')[0];
      if (!panel) return;
      let panelRect = panel.getBoundingClientRect();

      let textarea : any = document.getElementById('question');
      if (!textarea) return;
      let textareaRect = textarea.getBoundingClientRect();

      panel.style.top = (textareaRect.top - 20 - panelRect.height) + 'px';
    }, time);

  }
  
  calculateScroll() {
    setTimeout(() => {
      this.scrolltop = this.comment.nativeElement.scrollHeight;
    }, 100);
  }



  


  generateAssistantContent(annotationCode?: string) : void {
    this.assistantAnottations = [];

    for (let annotation of this.generalAnnotations) {

      if (!annotationCode || annotation.key.toLowerCase().indexOf(annotationCode.toLowerCase()) >= 0) {
        this.assistantAnottations.push({
          key: annotation.key,
          value: annotation.value,
          code: annotationCode
        });
      }
    }
  }

  onAnnotationClick(annotation: any) : void {

    let textarea : any = document.getElementById('question');
    let caretPosition = textarea.selectionStart - 1;    

    if (annotation.code && annotation.code.length > 0) {
      let anottationStart = this.question.lastIndexOf(annotation.code, caretPosition);

      if (anottationStart >= 0) {

        let firstText = this.question.substring(0, anottationStart);
        let secondText = this.question.substring(anottationStart+annotation.code.length+1);

        this.question = firstText + annotation.key + ' ' + secondText;
      }
    }

    else {
      this.question = this.question.substring(0, caretPosition) + ' ' + annotation.key + ' ' + this.question.substring(caretPosition);
    }


    this.assistantPanel.hide();  
  }

  formattedKey(annotation: any) : string {

    let key = annotation.key;
    let annotationCode = annotation.code;

    let index = key.toLowerCase().indexOf(annotationCode.toLowerCase());
    if (index < 0) return key;

    let originalPartialKey= key.substring(index, index+annotationCode.length);
    return key.replace(originalPartialKey, '<span class="text-blue-500 font-bold">'+originalPartialKey+'</span>');
  }

  onChangeChat(event: any) : void {

    this.messages = [];
    if (this.selectedChat == null) return;

    this.navigatorService.setLoading(true);

    this.chatService.getMessages(this.selectedChat.id).subscribe({
      next: res => {
        this.messages = res;
        this.navigatorService.setLoading(false);
        this.calculateScroll();
      },
      error: err => {
        console.error(err);
        this.navigatorService.setLoading(false);
      }
    });
  }

  onCreateChat() : void {
    this.messages = [];
    this.question = '';
    //this.chats = [...this.chats];
    this.selectedChat = null;
  }


}
