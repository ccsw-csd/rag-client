import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentFile } from '../model/DocumentFile';
import { DocumentChunk } from '../model/DocumentChunk';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {


  constructor(
    private http: HttpClient,
  ) {}

  getDocumentsByCollectionId(collectionId: number): Observable<DocumentFile[]> {
    return this.http.get<DocumentFile[]>(environment.server + '/document/by-collection/'+collectionId);
  }

  getDocumentsByIds(ids: number[]): Observable<DocumentFile[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':'application/json, text/javascript, */*; q=0.01'
    });

    const body = new HttpParams()
      .set('ids', ids.join(','));

    return this.http.post<DocumentFile[]>(environment.server + '/document/list-by-ids', body,  {headers: headers});
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

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(environment.server + '/document/delete-from-source/'+documentId);
  }

  uploadDocuments(collectionId: number, formData: FormData): Observable<void> {

    return this.http.post<void>(environment.server + "/document/upload-in-collection/"+collectionId, formData);
  }


  createDocument(collectionId: number, filename: string):  Observable<void> {
    return this.http.put<void>(environment.server + "/document/create-in-collection/"+collectionId, {filename: filename});
  }


  /*
  parseDocument(document: DocumentFile, parseType: string): Observable<void> {
    return this.http.post<void>(environment.server + '/document/parse', {collectionId: document.collectionId, filename: document.filename, parseType: parseType, overwrite: true});
  }
  */


  generateChunks(documentId: number, tokensDoc: number, tokensCode: number): Observable<void> {
    return this.http.post<void>(environment.server + '/document/'+documentId+'/action', {deleteEmbeddings: true, deleteEnhacedChunks: true, deleteChunks: true, createChunks: true, chunkConfig: {chunkSizeDocumentation: tokensDoc, chunkSizeCode: tokensCode}});
  }

  generateEmbeddings(parentDocumentId: number, documentId: number, pathDocument: string): Observable<void> {



    return this.http.post<void>(environment.server + '/document/generate-embeddings/'+parentDocumentId, {id: documentId, path: pathDocument});
  }

  
}

