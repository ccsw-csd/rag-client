import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Collection } from '../models/Collection';
import { CollectionProperty } from '../models/CollectionProperty';

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

  findAllProperties(collectionId: number):Observable<CollectionProperty[]>{
    return this.http.get<CollectionProperty[]>(environment.server+"/collection/"+collectionId+"/properties");
  }

  findAllPrompts(collectionId: number):Observable<CollectionProperty[]>{
    return this.http.get<CollectionProperty[]>(environment.server+"/collection/"+collectionId+"/prompts");
  }


  saveProperties(collectionId: number, data: any) : Observable<void> {
    return this.http.post<void>(environment.server + "/collection/"+collectionId+"/properties", {properties: data});
  }
  

  
}