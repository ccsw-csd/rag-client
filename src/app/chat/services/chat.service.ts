import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Message } from '../model/Message';
import { EmbeddingMessage } from '../model/EmbeddingMessage';
import { Chat } from '../model/Chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient,
  ) {}


  public getEmbeddings(messageId: number): Observable<EmbeddingMessage[]> {
    return this.http.get<EmbeddingMessage[]>(environment.server + '/chat/embeddings/'+messageId);
  }

  public getMessages(chatId: number): Observable<Message[]> {
    return this.http.get<Message[]>(environment.server + '/chat/'+chatId);
  }


  public sendMessage(collectionId: number, message: string): Observable<Message> {
    return this.http.get<Message>(environment.server + '/chat/'+collectionId+'/question?question='+message);
  }

  public getChats(collectionId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>(environment.server + '/chat/list-by-collection/'+collectionId);
  }

  public createChats(collectionId: number, title: string): Observable<Chat> {
    return this.http.put<Chat>(environment.server + '/chat/create-by-collection/'+collectionId, {title: title});
  }


  
}

