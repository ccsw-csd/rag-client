import { Component, OnInit, ViewChild } from '@angular/core';
import { Document } from '../../model/Document';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { DocumentService } from '../../services/document.service';
import { DocumentChunk } from '../../model/DocumentChunk';
import { Observable, delay, finalize, mergeMap, of } from 'rxjs';
import { ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { AuthService } from 'src/app/core/services/auth.service';



interface PropertyItem {
  id: number;
  name: string;
  value: string;
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {


  documents : Document[] = [];
  documentChunks: DocumentChunk[] = [];

  files: TreeNode[] = [];
  selectedFile: TreeNode;

  itemsContextMenuTree!: MenuItem[];


  maxTokens = 0;
  properties!: PropertyItem[];


  theme = 'vs-light';

  codeModel: CodeModel = {
    language: 'markdown',
    uri: 'markdown.json',
    value: `No document selected`,
  };

  options  = {
    lineNumbers: true,
    contextmenu: false,
    lineNumbersMinChars: 3,
    wordWrap: "on",
    minimap: {
      enabled: false
    }
  };

  constructor(
    private navigatorService: NavigatorService,
    private documentService: DocumentService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {
  }


  launchAction(action: number, data: Document) {
    
    if (action == 0) {

      this.confirmationService.confirm({
        message: 'Si recarga el documento <b>se perderán los datos</b> generados a mano, los chunks y los embeddings.<br/><br/>¿Está seguro que quiere recargar el documento?',
        header: 'Atención, pérdida de datos',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.navigatorService.setLoading(true);
          this.documentService.parseDocument(data, 'chunk').subscribe( res => {
            this.loadDocuments();
          });
        },
        reject: () => {

        }
      });
    }
    
  }

  ngOnInit(): void {

    this.itemsContextMenuTree = [
      { label: 'Reiniciar Documento', icon: 'pi pi-refresh', command: (event) => this.launchAction(0, this.selectedFile.data) },
      { label: 'Generar Chunks', icon: 'pi pi-th-large', command: (event) => this.launchAction(1, this.selectedFile.data) },
      { label: 'Generar Mejoras', icon: 'pi pi-bolt', command: (event) => this.launchAction(2, this.selectedFile.data) },
      { label: 'Generar Embeddings', icon: 'pi pi-ia', command: (event) => this.launchAction(3, this.selectedFile.data) },
      { label: 'Borrar', icon: 'pi pi-trash', command: (event) => this.launchAction(4, this.selectedFile.data) }
    ];

    this.loadDocuments();

  }

  loadDocuments() : void {
    this.navigatorService.setLoading(true);
    this.documents = [];
    this.files = [];
    this.documentChunks = [];
    this.selectedFile = null;
    this.setTextInCodeEditor("No document selected");
    let collectionId = this.authService.getProperty("selected-collection").id;

    this.documentService.getDocumentsByCollectionId(collectionId).subscribe(
      documents => {

        this.documents = documents;

        for (let document of documents) {

          let icon = "pi pi-file";
          if (document.filename.endsWith('.docx')) icon = "pi pi-file-word";
          if (document.filename.endsWith('.pdf')) icon = "pi pi-file-pdf";

          this.files.push({
            key: ''+document.id,
            label: document.filename,
            icon: icon,
            leaf: true,            
            data: document
          });
         
        }

        this.navigatorService.setLoading(false);        
        this.updateDocumentStatus();
      }
    ); 
  }




  private updateDocumentStatus() : void {

    let ids = [];

    for (let document of this.documents) {
      if (document.status == "PROCESING") {
        ids.push(document.id);
      }
    }

    if (ids.length > 0) {

      this.documentService.getDocumentsByIds(ids).subscribe(documents => {
        for (let document of documents) {
          let documentFound = this.documents.find(doc => doc.id == document.id);
          documentFound.status = document.status;
        }

        setTimeout(() => {
          this.updateDocumentStatus();
        }, 10000);
      });
    }

  }


  selectDocument(event) {   
    let node = event.node;

    if (node.children && node.children.length > 0) {
      node.expanded=!node.expanded;
      return;
    }

    this.documentService.getDocumentChunks(node.data.id).subscribe( res => {

      this.documentChunks = [];

      for (let chunk of res) {
        this.documentChunks[chunk.order-1] = chunk;
      }

      this.getDocumentChunks();
    });
  }

  private countTokens(text: string) : number {

    let tokens = text.split(' ');
    return Math.round(tokens.length / 0.75);
  }

  private generateText() : void {
    this.maxTokens = 0;

    let text = '';
    for (let chunk of this.documentChunks) {

      let chunkText = '';

      if (chunk.loaded) chunkText = chunk.content;
      else chunkText = chunk.filename;
      
      text += chunkText;

      let tokens = this.countTokens(chunkText);
      this.maxTokens = Math.max(this.maxTokens, tokens);

      text += '\n\n\n\n----------------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------------\n\n\n\n'
    }

    this.setTextInCodeEditor(text);
  }

  private fillProperties() : void {
    
    let document: Document = this.selectedFile.data;

    this.properties = [
      { id: -1, name: 'Name', value: document.filename },
      { id: -2, name: 'Status', value: this.pascalCaseString(document.status) },
      { id: -3, name: 'Max Tokens', value: ''+this.maxTokens },
      { id: -4, name: 'Chunks', value: ''+this.documentChunks.length },
    ];

  }  

  private setTextInCodeEditor(text: string) : void {
    let newCodeModel = this.codeModel;
    newCodeModel.value = text;

    this.codeModel = JSON.parse(JSON.stringify(newCodeModel));
  }

  private getDocumentChunks() : void {

    this.generateText();
    this.fillProperties();  

    const numberOfSimultaneousRequests = 10;
    let allApiCalls = Array.from({ length: this.documentChunks.length }, (_, i) => this.documentService.getContentFromDocumentChunk(parseInt(this.selectedFile.data.id), this.documentChunks[i].id));

    of(...allApiCalls)
    .pipe(mergeMap((apiCall) => apiCall, numberOfSimultaneousRequests), finalize(() => {
      this.generateText();
      this.fillProperties();  
    }))  
    .subscribe((response) => {
      let chunk = this.documentChunks.filter(chunk => chunk.id == response.id)[0];
      chunk.content = response.content;
      chunk.loaded = true;
      
    });

  }

  private pascalCaseString(str: string) : string {
    return str.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
  }


  onCodeChanged(): void {
console.log('Entra')
debugger

this.codeEditor.editor.layout();
  }


  
  @ViewChild(CodeEditorComponent, { static: false })
  private codeEditor: CodeEditorComponent;

  updateDimensions() {
    this.codeEditor.editor.layout();
  }



}
