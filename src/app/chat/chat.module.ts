import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './views/chat/chat.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { ChatInfoComponent } from './views/chat-info/chat-info.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    ChatComponent,
    ChatInfoComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    FieldsetModule,
  ]
})
export class ChatModule { }
