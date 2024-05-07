import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptEditComponent } from './views/prompt-edit/prompt-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabViewModule } from 'primeng/tabview';
import { PromptImportComponent } from './views/prompt-import/prompt-import.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PromptListComponent } from './views/prompt-list/prompt-list.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { PromptViewComponent } from './views/prompt-view/prompt-view.component';
import { BadgeModule } from 'primeng/badge';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
  declarations: [
    PromptEditComponent,
    PromptImportComponent,
    PromptListComponent,
    PromptViewComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    FieldsetModule,
    ConfirmDialogModule,
    ButtonModule,
    ContextMenuModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicDialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    ChipModule,
    TableModule,
    SelectButtonModule,
    MarkdownModule.forRoot(),
    TabViewModule,
    AutoCompleteModule,
    ToastModule,
    BadgeModule,
    AutosizeModule,
  ]
})
export class PromptModule { }
