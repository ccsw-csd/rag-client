import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Collection } from '../models/Collection';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private http:HttpClient) { }

  findAll():Observable<Collection[]>{
    return this.http.get<Collection[]>(environment.server+"/collection");
  }

  save(collection: Collection):Observable<Collection>{
    return this.http.post<Collection>(environment.server + "/collection", collection);
  }
}
