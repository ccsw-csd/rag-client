import { Component } from '@angular/core';
import { Collection } from '../model/Collection';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { CollectionService } from '../collection.service';
import { CollectionEditComponent } from '../collection-edit/collection-edit.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  providers: [DialogService, DynamicDialogRef, DynamicDialogConfig, ConfirmationService]
})
export class CollectionListComponent {

  tableWidth: string;

  collections: Collection[] = [];

  constructor(
    private navigatorService: NavigatorService,
    private collectionService: CollectionService,
    private ref: DynamicDialogRef,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.resizeTable();

    this.navigatorService.getNavivagorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 250px)';
      else this.tableWidth = 'calc(100vw - 50px)';
    });

    this.loadCollections();
  }

  loadCollections(){
    this.collectionService.loadCollections().subscribe({
      next: (res: Collection[]) => {
        this.collections = res;
      },
    });
  }

  editCollection(collection: Collection){
    let header = 'Edit collection';
    this.ref = this.dialogService.open(CollectionEditComponent,{
      width:'75vw',
      data:{
        collection: collection,
        name: collection.name,
        description: collection.description,
      },
      closable:false,
      showHeader: true,
      header: header
    });
    this.onClose();
  }

  createCollection(){
    let header = 'New collection';
    this.ref = this.dialogService.open(CollectionEditComponent,{
      width:'75vw',
      data:{
        collection: null,
        name: null,
        description: null,
      },
      closable:false,
      showHeader: true,
      header: header
    });
    this.onClose();
  }


  onClose(): void {
    this.ref.onClose.subscribe((results: any) => {
      this.loadCollections();
    });
  }


  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }
}
