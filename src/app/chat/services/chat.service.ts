import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../model/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
  ) {}

  public sendMessage(collectionId: number, message: string): Observable<Message> {
    return this.http.get<Message>(environment.server + '/chat/'+collectionId+'?question='+message);
  }


  
}

