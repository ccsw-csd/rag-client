import { Component } from '@angular/core';
import { Collection } from '../model/Collection';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent {

  tableWidth: string;

  collections: Collection[] = [];

  constructor(
    private navigatorService: NavigatorService,
    private collectionService: CollectionService,
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
    
  }


  resizeTable() {
    if (document.getElementById('p-slideMenu')) {
      this.tableWidth = 'calc(100vw - 255px)';
    } else {
      this.tableWidth = 'calc(100vw - 55px)';
    }
  }
}
