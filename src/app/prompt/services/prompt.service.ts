import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Prompt } from '../models/Prompt';
import { PromptStats } from '../models/PromptStats';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(
    private http: HttpClient,
  ) { }


  getAll(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(environment.server + '/prompt');
  }


  getById(promptId: any): Observable<Prompt> {
    return this.http.get<Prompt>(environment.server + '/prompt/'+promptId);
  }

  like(promptId: any): Observable<PromptStats> {
    return this.http.post<PromptStats>(environment.server + '/prompt/'+promptId+'/like', null);
  }

  view(promptId: any): Observable<PromptStats> {
    return this.http.post<PromptStats>(environment.server + '/prompt/'+promptId+'/view', null);
  }


  findTags(query: string): Observable<string[]> {
    return this.http.get<string[]>(environment.server + '/prompt/tags/'+query);
  }

  save(prompt: Prompt): Observable<void> {
    return this.http.put<void>(environment.server + '/prompt', prompt);    
  }

  delete(promptId: any): Observable<void> {
    return this.http.delete<void>(environment.server + '/prompt/'+promptId);
  }


}
