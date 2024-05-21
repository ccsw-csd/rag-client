import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Collection } from '../../models/Collection';
import { CollectionService } from '../../services/collection.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';


@Component({
  selector: 'app-collection-edit',
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.scss']
})
export class CollectionEditComponent {

  collection: Collection;

  constructor(
    private ref: DynamicDialogRef,
    private collectionService: CollectionService,
    private config: DynamicDialogConfig,
    private navigatorService: NavigatorService,

  ) {

  }

  ngOnInit(): void {

    this.collection = Object.assign({name:null, description:null}, this.config.data);
    
  }
  

  onSave() : void {

    this.navigatorService.setLoading(true);

    this.collectionService.save(this.collection).subscribe({
      next: (res) => {
        this.navigatorService.setLoading(false);
        this.ref.close(true);
      },
    });

  }

  onClose() : void {
    this.ref.close(false);
  }

}
