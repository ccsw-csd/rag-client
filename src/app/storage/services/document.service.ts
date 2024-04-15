import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from '../model/Document';
import { DocumentChunk } from '../model/DocumentChunk';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private http: HttpClient,
  ) {}

  getDocumentsByCollectionId(collectionId: number): Observable<Document[]> {
    return this.http.get<Document[]>(environment.server + '/document/by-collection/'+collectionId);
  }

  getDocumentsByIds(ids: number[]): Observable<Document[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':'application/json, text/javascript, */*; q=0.01'
    });

    const body = new HttpParams()
      .set('ids', ids.join(','));

    return this.http.post<Document[]>(environment.server + '/document/list-by-ids', body,  {headers: headers});
  }

  saveDocumentChunks(documentId: number, contents: string[]): Observable<void> {
    return this.http.post<void>(environment.server + '/document/'+documentId+'/chunks', {contents: contents});
  }

  getDocumentChunks(documentId: number): Observable<DocumentChunk[]> {
    return this.http.get<DocumentChunk[]>(environment.server + '/document/'+documentId+'/chunks/0');
  }

  getContentFromDocumentChunk(documentId: number, chunkId: number): Observable<DocumentChunk> {
    return this.http.get<DocumentChunk>(environment.server + '/document/'+documentId+'/chunk/'+chunkId+'/content');
  }

  parseDocument(document: Document, parseType: string): Observable<void> {
    return this.http.post<void>(environment.server + '/document/parse', {collectionId: document.collectionId, filename: document.filename, parseType: parseType, overwrite: true});
  }


  generateChunks(documentId: number, tokens: number): Observable<void> {
    return this.http.post<void>(environment.server + '/document/'+documentId+'/action', {deleteEmbeddings: true, deleteEnhacedChunks: true, deleteChunks: true, createChunks: true, chunkConfig: {chunkSize: tokens}});
  }

  generateEmbeddings(documentId: number): Observable<void> {
    return this.http.post<void>(environment.server + '/document/'+documentId+'/action', {deleteEmbeddings: true, createEmbeddings: true});
  }

  
}

