import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Post } from '../../models/Post';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-prompt-import',
  templateUrl: './prompt-import.component.html',
  styleUrls: ['./prompt-import.component.scss']
})
export class PromptImportComponent implements OnInit {

  jsonData : string = '';  
  showDelayedView: boolean = false;
  

  constructor(
    private ref: DynamicDialogRef,
    private authService: AuthService,
  ) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.showDelayedView = true;
    }, 1000);
  }
  


  onClose() {
    this.ref.close({});
  }


  onImport() {

    let posts: Post[] = [];

    try {
      let parsedJson = JSON.parse(this.jsonData);

      posts = this.parseChatGPT(parsedJson);
    }
    catch (e) {}

    this.ref.close({data: posts});
  }


  parseChatGPT(parsedJson: any) : Post[] {

    let posts: Post[] = [];    
    let arrayData = [];

    let keys = Object.keys(parsedJson.mapping);
    for (let key of keys) {
      arrayData.push(parsedJson.mapping[key]);
    }
    
    arrayData = arrayData.filter(item => item.message != null && (item.message.author.role == 'user' || item.message.author.role == 'assistant'));
    arrayData.sort((a, b) => {return a.message.create_time - b.message.create_time});

    let finedArray = arrayData.map(item => {return {author: item.message.author.role, content: item.message.content.parts.join('\n')}});
    for (let message of finedArray) {

      let item : Post = null;

      if (message.author == 'user') {
        item = {
          author: this.authService.getUserInfo().displayName,
          content: message.content.replaceAll('\n', '<br/>\n'),
          type: 'user',
        };
    
      }
      else {
        item = {
          author: 'Assistant',
          content: message.content,
          type: 'ia',
        };
    
      }

      posts.push(item);
    }

    return posts;
  }



}
