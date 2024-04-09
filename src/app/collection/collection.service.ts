import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Collection } from './model/Collection';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http:HttpClient) { }

  loadCollections():Observable<Collection[]>{
    return this.http.get<Collection[]>(environment.server+"/collection/");
  }

  save(collection: Collection):Observable<Collection>{
    return this.http.post<Collection>(environment.server + "/collection", collection);
  }
}
