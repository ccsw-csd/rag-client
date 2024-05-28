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
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    ChatComponent,
    ChatInfoComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
    TableModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
    FieldsetModule,
    TranslateModule,
    DropdownModule,
    InputTextareaModule,
    OverlayPanelModule,
    ListboxModule,
    MenuModule,
    ConfirmDialogModule,
    DialogModule,
    SliderModule,
    PasswordModule,
    CheckboxModule,
  ]
})
export class ChatModule { }
