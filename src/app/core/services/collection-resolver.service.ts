import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CollectionService } from './collection.service';
import { Collection } from 'src/app/collection/model/Collection';

@Injectable()
export class CollectionResolverService implements Resolve<any> {
  constructor(private http: HttpClient,
    private collectionService: CollectionService,) { }

  /**
   * resolve method
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Collection[]> {
    return this.collectionService.findAll();
  }

}