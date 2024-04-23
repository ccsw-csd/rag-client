import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../model/Message';
import { EmbeddingMessage } from '../../model/EmbeddingMessage';

@Component({
  selector: 'app-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss']
})
export class ChatInfoComponent {

  message: Message;
  messagePrevious: Message;
  embeddings: EmbeddingMessage[] = [];

  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private chatService: ChatService,

  ) {
    this.message = config.data.message;
    this.messagePrevious = config.data.messagePrevious;

    this.embeddings = [];

    this.chatService.getEmbeddings(this.message.id).subscribe({
      next: res => {
        this.embeddings = res;
      },
      error: err => {
        console.error(err);
      }
    });
  }


  onClose(){
    this.ref.close();
  }

}
