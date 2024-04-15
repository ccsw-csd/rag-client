import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Document } from '../../model/Document';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { DocumentService } from '../../services/document.service';
import { DocumentChunk } from '../../model/DocumentChunk';
import { finalize, mergeMap, of } from 'rxjs';
import { ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TabPanel } from 'primeng/tabview';
import { DialogService } from 'primeng/dynamicdialog';
import { ChunkDialogComponent } from '../chunk-dialog/chunk-dialog.component';
import { Tree } from 'primeng/tree';




interface PropertyItem {
  id: number;
  name: string;
  value: string;
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
  providers: [DialogService]
})
export class StorageComponent implements OnInit {

  timerGenerateChunksFromCodeEditor: any = null;

  documentModified : boolean = false;

  documents : Document[] = [];
  documentChunks: DocumentChunk[] = [];
  selectedDocumentChunk: DocumentChunk;
  selectedDocument: Document;

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
    smoothScrolling: true,
    wordWrap: "on",
    minimap: {
      enabled: false
    }
  };

  @ViewChild('tabPanelContent', { static: false })
  private tabPanel: TabPanel;
  
  @ViewChild(CodeEditorComponent, { static: false })
  private codeEditor: CodeEditorComponent;

  @ViewChild('treePanel', { static: false })
  private treePanel: Tree;

  


  constructor(
    private navigatorService: NavigatorService,
    private documentService: DocumentService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
  }


  ngOnInit(): void {

    this.itemsContextMenuTree = [
      { label: 'Reset Document', icon: 'pi pi-refresh', command: (event) => this.launchAction(0, this.selectedFile.data) },
      { label: 'Generate Chunks', icon: 'pi pi-th-large', command: (event) => this.launchAction(1, this.selectedFile.data) },
      { label: 'Generate Enhanced', icon: 'pi pi-bolt', command: (event) => this.launchAction(2, this.selectedFile.data) },
      { label: 'Generate Embeddings', icon: 'pi pi-ia', command: (event) => this.launchAction(3, this.selectedFile.data) },
      { label: 'Remove Document', icon: 'pi pi-trash', command: (event) => this.launchAction(4, this.selectedFile.data) }
    ];

    this.loadDocuments();

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
    else if (action == 1) {

      let ref = this.dialogService.open(ChunkDialogComponent, {
        header: 'Generate chunks',
        width: '600px',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false,
        closable: false,
        data: { document: data }
      });

      ref.onClose.subscribe((result) => {
        if (result.toRefresh) {
          this.navigatorService.setLoading(true);
          this.loadDocuments();
        }
      });


    }
    else if (action == 3) {

      this.confirmationService.confirm({
        message: 'Va a generar de nuevo todos los embeddings de los chunks que tiene el documento (originales, enhanced y personal notes).<br/>Perderá los embeddigns que ya tuviera y supondrá un <b>coste en tokens</b> de OpenAI.<br/><br/>¿Está seguro que quiere generar embeddings?',
        header: 'Atención, pérdida de datos',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.navigatorService.setLoading(true);
          this.documentService.generateEmbeddings(data.id).subscribe( res => {
            this.loadDocuments();
          });
        },
        reject: () => {

        }
      });


    }
    
  }


  loadDocuments() : void {
    this.navigatorService.setLoading(true);
    this.documents = [];
    this.files = [];
    this.documentChunks = [];
    this.selectedFile = null;
    this.setTextInCodeEditor("No document selected");
    this.documentModified = false;
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
            selectable: document.status != "PROCESSING",          
            data: document
          });
         
        }

        this.navigatorService.setLoading(false);        
        this.updateDocumentStatus();
        this.documentModified = false;
      }
    ); 
  }




  private updateDocumentStatus() : void {

    let ids = [];

    for (let document of this.documents) {
      if (document.status == "PROCESSING") {
        ids.push(document.id);
      }
    }

    if (ids.length > 0) {

      this.documentService.getDocumentsByIds(ids).subscribe(documents => {
        for (let document of documents) {
          let documentFound = this.documents.find(doc => doc.id == document.id);
          documentFound.status = document.status;
          this.files.find(file => file.data.id == document.id).selectable = document.status != "PROCESSING";
        }

        setTimeout(() => {
          this.updateDocumentStatus();
        }, 10000);
      });
    }

  }



  private countTokens(text: string) : number {

    let tokens = text.split(' ');
    return Math.round(tokens.length / 0.75);
  }

  private generateLoadDocumentText() : void {

    let text = '';
    for (let chunk of this.documentChunks) {

      let chunkText = '';

      if (chunk.loaded) chunkText = chunk.content;
      else chunkText = chunk.filename;
      
      text += chunkText;

      if (chunk.order < this.documentChunks.length) 
        text += '\n\n\n\n----------------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------------\n\n\n\n'
    }

    this.setTextInCodeEditor(text);       
  }

  private generateChunksFromCodeEditor() : void {

    if (this.selectedDocument == null) return;

    let lines = this.codeModel.value.split("\n");
    let order = 1;
    let countLines = 0;
    let lineNumber = 0;
    this.documentChunks = [];
    let chunkContent = '';
    let chunkLineNumber = 1;
    this.maxTokens = 0;

    
    for (let line of lines) {

      lineNumber++;

      if (line.startsWith('--------------')) {
        countLines++;
      }
      else {
        chunkContent += line + '\n';
      }

      if (countLines == 3) {
        
        let tokens = this.countTokens(chunkContent);
        this.maxTokens = Math.max(this.maxTokens, tokens);

        this.documentChunks.push({ id: 0, order: this.documentChunks.length+1, filename: this.selectedDocument.filename, content: chunkContent, loaded: true, lineNumber: chunkLineNumber, tokens: tokens });

        chunkLineNumber = lineNumber+1;
        chunkContent = '';
        order++;
        countLines = 0;        
      }


    }

    let tokens = this.countTokens(chunkContent);
    this.maxTokens = Math.max(this.maxTokens, tokens);

    this.documentChunks.push({ id: 0, order: this.documentChunks.length+1, filename: this.selectedDocument.filename, content: chunkContent, loaded: true, lineNumber: chunkLineNumber, tokens: tokens});

    this.fillProperties();

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
    setTimeout(()=>{this.documentModified = false;}, 1);
  }

  private getDocumentChunks() : void {

    this.generateLoadDocumentText();
    this.fillProperties();  

    const numberOfSimultaneousRequests = 10;
    let allApiCalls = Array.from({ length: this.documentChunks.length }, (_, i) => this.documentService.getContentFromDocumentChunk(parseInt(this.selectedFile.data.id), this.documentChunks[i].id));

    of(...allApiCalls)
    .pipe(mergeMap((apiCall) => apiCall, numberOfSimultaneousRequests), 
    finalize(() => {
      this.generateLoadDocumentText();
      this.generateChunksFromCodeEditor();
      this.navigatorService.setLoading(false);
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


  onSave(): void {
    this.navigatorService.setLoading(true);
    this.generateChunksFromCodeEditor();

    this.documentService.saveDocumentChunks(this.selectedDocument.id, this.documentChunks.map(chunk => chunk.content)).subscribe( res => {
      this.documentModified = false;
      this.navigatorService.setLoading(false);
    });
  }



  onSelectDocumentChunk(event) : void {
    let lineNumber = this.selectedDocumentChunk.lineNumber;

    this.codeEditor.editor.revealLineNearTop(lineNumber);
    this.codeEditor.editor.setPosition({column: 1, lineNumber: lineNumber});
  }

  onSelectDocument(event) : void {   
    let node = event.node;

    if (node.children && node.children.length > 0) {
      node.expanded=!node.expanded;
      return;
    }

    this.navigatorService.setLoading(true);
    this.documentModified = false;
    this.selectedDocument = node.data;


    this.documentService.getDocumentChunks(node.data.id).subscribe( res => {

      this.documentChunks = [];

      for (let chunk of res) {
        this.documentChunks[chunk.order-1] = chunk;
      }

      this.getDocumentChunks();
    });
  }  

  onCodeChanged(): void {
    this.documentModified = true;
    if (this.timerGenerateChunksFromCodeEditor != null) clearTimeout(this.timerGenerateChunksFromCodeEditor);

    this.timerGenerateChunksFromCodeEditor = setTimeout(() => {
      this.generateChunksFromCodeEditor();
    }, 5000);
    

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) : void {
    let editor = this.codeEditor.editor;

    editor.layout({width: 0, height: 0});

    window.requestAnimationFrame(() => {
        const rect = this.tabPanel.el.nativeElement.getBoundingClientRect()

        editor.layout({width: rect.width, height: rect.height-2})
    })
  }

}
