import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptViewComponent } from './views/prompt-view/prompt-view.component';
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
import { DragDropModule } from 'primeng/dragdrop';

@NgModule({
  declarations: [
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
    DragDropModule,
    MarkdownModule.forRoot(),
  ]
})
export class PromptModule { }
