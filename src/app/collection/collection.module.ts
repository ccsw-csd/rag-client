import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    CollectionListComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ]
})
export class CollectionModule { }
