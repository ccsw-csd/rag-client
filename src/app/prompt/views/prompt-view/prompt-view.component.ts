import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ChatService } from 'src/app/chat/services/chat.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Prompt } from '../../models/Prompt';
import { DATA } from '../../models/response';

@Component({
  selector: 'app-prompt-view',
  templateUrl: './prompt-view.component.html',
  styleUrls: ['./prompt-view.component.scss']
})
export class PromptViewComponent implements OnInit {

  prompt: Prompt;
 
  @ViewChild("contentData") contentData : ElementRef; 
  
  constructor(
    private navigatorService: NavigatorService,
    private authService: AuthService,
    private chatService: ChatService,
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

    this.parseChatGPT(DATA);


  }

  parseChatGPT(data: any) : void {

    let keys = Object.keys(data.mapping);

    let arrayData = [];

    for (let key of keys) {

      arrayData.push(data.mapping[key]);
    }
    

    arrayData = arrayData.filter(item => item.message != null && (item.message.author.role == 'user' || item.message.author.role == 'assistant'));

    arrayData.sort((a, b) => {return a.message.create_time - b.message.create_time});



    let finedArray = arrayData.map(item => {return {author: item.message.author.role, content: item.message.content.parts.join('\n')}});


    let order = 1;

    for (let message of finedArray) {

      this.prompt.posts.push(
      {id: order,
        order: order,
        author: message.author,
        content: message.author == 'user' ? message.content.replaceAll('\n', '&nbsp;<br/>') : message.content,
        type: message.author == 'user' ? 'text': 'markdown',
      });

      order++;
    }

    console.log(this.prompt)

  }


  getAbbreviatedName(name: string): string {
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }


  drop(event: any) {
    console.log(event);

    let y = event.target.offsetTop;



    for (let i = 0; i < this.contentData.nativeElement.children.length; i++) {

      let element = this.contentData.nativeElement.children[i];

      if (y < element.offsetTop + element.offsetHeight) {
        break;
      }

    }
    

  }

}


