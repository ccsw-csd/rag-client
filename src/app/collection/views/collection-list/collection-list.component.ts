import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/Collection';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { CollectionService } from '../../services/collection.service';
import { CollectionEditComponent } from '../collection-edit/collection-edit.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { CollectionConfigurationComponent } from '../collection-configuration/collection-configuration.component';
import { CollectionPromptComponent } from '../collection-prompt/collection-prompt.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
  providers: [ DynamicDialogRef, DynamicDialogConfig]
})
export class CollectionListComponent implements OnInit {

  tableWidth: string;

  collections: Collection[] = [];

  constructor(
    private navigatorService: NavigatorService,
    private collectionService: CollectionService,
    private dialogService: DialogService,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.resizeTable();

    this.navigatorService.getNavigatorChangeEmitter().subscribe((menuVisible) => {
      if (menuVisible) this.tableWidth = 'calc(100vw - 250px)';
      else this.tableWidth = 'calc(100vw - 50px)';
    });

    this.loadCollections();
  }

  loadCollections() : void {

    this.navigatorService.setLoading(true);

    this.collectionService.findAll().subscribe({
      next: (res: Collection[]) => {
        this.collections = res;
        this.navigatorService.setLoading(false);
      },
    });
  }

  onEditPrompt(collection: Collection) : void{

    let ref = this.dialogService.open(CollectionPromptComponent, {
      header: 'Configuración de los prompts de la colección: '+collection.description,
      width: '900px',
      height: '90vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      data: collection
    });


  }


  onConfig(collection: Collection) : void{

    let ref = this.dialogService.open(CollectionConfigurationComponent, {
      header: 'Configuración de la colección: '+collection.description,
      width: '800px',
      height: '615px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      data: collection
    });


  }

  onEdit(collection: Collection) : void {

    let header = this.translateService.instant('collections.edit.title-new');
    if (collection)
      header = this.translateService.instant('collections.edit.title-edit');

    let ref = this.dialogService.open(CollectionEditComponent,{
      header: header,
      width:'500px',
      height: '275px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false,
      data: collection
    });

    ref.onClose.subscribe((results: any) => {
      if (results)
        this.loadCollections();
    });
  }

  onCreate(){
    this.onEdit(null);
  }


  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }
}
