import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DocumentFile } from '../../model/DocumentFile';
import { CodeEditorComponent, CodeModel } from '@ngstack/code-editor';
import { DocumentService } from '../../services/document.service';
import { DocumentChunk } from '../../model/DocumentChunk';
import { ConfirmationService, MenuItem, TreeNode } from 'primeng/api';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TabPanel } from 'primeng/tabview';
import { DialogService } from 'primeng/dynamicdialog';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';




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

  documents : DocumentFile[] = [];
  documentChunks: DocumentChunk[] = [];
  selectedDocumentChunk: DocumentChunk;
  selectedDocument: DocumentFile;

  flatFiles: TreeNode[] = [];
  files!: TreeNode[];
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


  


  constructor(
    private navigatorService: NavigatorService,
    private documentService: DocumentService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private dialogService: DialogService
  ) {
  }


  ngOnInit(): void {

    this.navigatorService.getNavivagorChangeEmitter().subscribe(menuVisible => {
      if (menuVisible) this.onResize(null);
      else setTimeout(()=>this.onResize(null), 200);
    });

    this.itemsContextMenuTree = [
      { label: 'Generate Enhanced', icon: 'pi pi-bolt', command: (event) => this.onLaunchAction(1, this.selectedFile.data) },
      { label: 'Generate Embeddings', icon: 'pi pi-ia', command: (event) => this.onLaunchAction(2, this.selectedFile.data) },
      { label: 'Remove Document', icon: 'pi pi-trash', command: (event) => this.onLaunchAction(3, this.selectedFile.data) }
    ];

    this.loadDocuments();

  }





  createNode(key: string, documentId: number, id:number, path: string, label: string) : TreeNode {
    return {
      key: key,
      leaf: false,
      expanded: false,
      selectable: true,
      expandedIcon: "pi pi-folder-open",
      collapsedIcon: "pi pi-folder",
      data: {leaf:false, isRoot: false, parentDocumentId: documentId, data: {filename: label, id:id, path: path}},
      children: []
    }
  }

  sanitizePath(path: string) : string {
    return path.startsWith('/') ? path.substring(1) : path;
  }


  generateRecursiveTree(node: any) : any {

    let info = {
      key: node.path,
      leaf: false,
      expanded: false,
      selectable: true,   
      data: {leaf:false, isRoot: false, icon: null, parentDocumentId: node.parentDocumentId, data: {filename: node.name}, id: null, path: node.path, parentDocumentName: node.parentDocumentName},
      children: []
    } 

    if (node.document) {

      let icon = "pi pi-file";
      if (node.document.filename.endsWith('.docx')) icon = "pi pi-file-word";
      if (node.document.filename.endsWith('.pdf')) icon = "pi pi-file-pdf";
        
      info.key = node.path+"/"+node.name;
      info.leaf = true;
      info.data.leaf = true;
      info.data.icon = icon;
      info.data.parentDocumentId = node.document.document.id;
      info.data.id = node.document.id;
      info.data.data = node.document;
    }


    for (let child of node.children) {
      info.children.push(this.generateRecursiveTree(child));
    }


    if (info.leaf) this.flatFiles.push(info);
    return info;

  }


  sanitizeTreeNode(node: TreeNode) : void {

    if (node.children.length == 0) return;

    if (node.children.length > 1) {

      for (let i = 0; i < node.children.length; i++) {
        this.sanitizeTreeNode(node.children[i]);
      }

      return;
    }

    let child = node.children[0];

    if (child.leaf) return;

    node.data.data.filename += '/'+child.data.data.filename;
    node.children = child.children;

    this.sanitizeTreeNode(node);
  }


  createTree(document: any, documentFiles: DocumentFile[]) : TreeNode {

    documentFiles.forEach(c => c.path = this.sanitizePath(c.path).substring(document.filename.length+1));

    let uniquePaths = Array.from(documentFiles.map(c => c.path));


    let dictionary = {};

    let rootFolder = {
      path: '/',
      name: document.filename, 
      parentDocumentName: document.filename,
      children: []
    }

    for (let path of uniquePaths) {

      let splitPaths = path.split('/');

      for (let i = 1; i <= splitPaths.length; i++) {

        let currentPath = splitPaths.slice(0, i).join('/');
        let parentPath = splitPaths.slice(0, i-1).join('/');
                
        if (dictionary[currentPath]) continue;

        let parentNode;
        if (i == 1) parentNode = rootFolder;
        else parentNode = dictionary[parentPath];

        let info = {
          parentDocumentId: document.id,
          parentDocumentName: document.filename,
          path: currentPath,
          name: splitPaths[i-1],
          children: []
        }

        parentNode.children.push(info);
        dictionary[currentPath] = info;
      }
    }


    for (let documentFile of documentFiles) {

      let parentInfo = dictionary[documentFile.path];

      if (!parentInfo) {
        continue;
      }

      parentInfo.children.push({
        parentDocumentId: document.id,
        parentDocumentName: document.filename,
        path: documentFile.path,
        name: documentFile.filename,
        document: documentFile,
        children: []
      });

    }

    let documentRootNode = this.generateRecursiveTree(rootFolder);
    documentRootNode.data.isRoot = true;
    documentRootNode.data.parentDocumentId = document.id;

    this.sanitizeTreeNode(documentRootNode);

    return documentRootNode;
  }


  loadDocuments() : void {
    this.navigatorService.setLoading(true);
    this.documents = [];
    this.files = [];
    this.flatFiles = [];
    this.documentChunks = [];
    this.selectedFile = null;
    this.setTextInCodeEditor("No document selected");
    this.documentModified = false;
    let collectionId = this.authService.getProperty("selected-collection").id;

    this.documentService.getDocumentsByCollectionId(collectionId).subscribe(
      documents => {

        this.documents = documents;
        this.navigatorService.setLoading(false);        


        this.files = [];

        let rootDocuments = Array.from((new Map(documents.map(c => [c.document.id, c.document]))).values());

        for (let document of rootDocuments) {

          let children = documents.filter(doc => doc.document.id == document.id);

          if (children.length == 1) {
              
              let documentFile = children[0];

              let icon = "pi pi-file";
              if (documentFile.filename.endsWith('.docx')) icon = "pi pi-file-word";
              if (documentFile.filename.endsWith('.pdf')) icon = "pi pi-file-pdf";
                
              let node = {
                key: ''+documentFile.id,
                leaf: true,
                data: {leaf:true, icon: icon, parentDocumentId: documentFile.document.id,  id: documentFile.id, isRoot: true, data: documentFile}
              };

              this.files.push(node);              
              this.flatFiles.push(node);
          }
          else {
            this.files.push(this.createTree(document, children));          
          }

        }

        this.navigatorService.setLoading(false);        
        this.updateDocumentStatus();
        this.documentModified = false;
      }
    ); 
  }




  private updateDocumentStatus() : void {


    let ids = this.flatFiles.filter(file => file.data.data.status == "PROCESSING").map(file => file.data.data.id)

    if (ids.length > 0) {

      this.documentService.getDocumentsByIds(ids).subscribe(documents => {


        for (let document of documents) {

          let documentFound = this.flatFiles.find(doc => doc.data.data.id == document.id);
          documentFound.data.data.status = document.status;
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

      let chunkText = chunk.content;

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
    
    this.properties = [
      { id: -1, name: 'Name', value: this.selectedDocument.filename },
      { id: -2, name: 'Status', value: this.pascalCaseString(this.selectedDocument.status) },
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
    if (!node.data.leaf) return;

    this.selectedFile = node;
    this.selectedDocument = node.data.data;
    
    this.navigatorService.setLoading(true);
    this.documentModified = false;


    this.documentService.getDocumentChunks(this.selectedDocument.id).subscribe( res => {

      this.documentChunks = [];

      for (let chunk of res) {
        this.documentChunks[chunk.order-1] = chunk;
      }

      this.generateLoadDocumentText();
      this.generateChunksFromCodeEditor();
      this.navigatorService.setLoading(false);
    });
  }  

  onCodeChanged(): void {
    this.documentModified = true;
    if (this.timerGenerateChunksFromCodeEditor != null) clearTimeout(this.timerGenerateChunksFromCodeEditor);

    this.timerGenerateChunksFromCodeEditor = setTimeout(() => {
      this.generateChunksFromCodeEditor();
    }, 5000);
    

  }

  onUploadFile() : void {
    
    let ref = this.dialogService.open(UploadDialogComponent, {
      header: 'Upload document',
      width: '800px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false,
      closable: false
    });

    ref.onClose.subscribe((result) => {
      if (result.toRefresh) {
        this.navigatorService.setLoading(true);
        this.loadDocuments();
      }
    });    


  }


  onLaunchAction(action: number, data: any) {
    
    if (action == 2) {

      this.confirmationService.confirm({
        message: 'Vas a generar de nuevo todos los embeddings de los chunks que tiene el documento (originales, enhanced y personal notes).<br/>Perderás los embeddigns que ya tuvieras y supondrá un <b>coste en tokens</b> de OpenAI.<br/><br/>¿Está seguro que quieres generar embeddings?',
        header: 'Atención, pérdida de datos',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.navigatorService.setLoading(true);

          let path = data.parentDocumentName + '/' + data.path;
          if (data.isRoot) path = '';

          this.documentService.generateEmbeddings(data.parentDocumentId, data.data.id, path).subscribe( res => {
            this.loadDocuments();
          });
        },
        reject: () => {

        }
      });

    }    

    else if (action == 3) {


      if (data.isRoot == false) {

        this.confirmationService.confirm({
          message: 'Tan solo puedes borrar documentos completos, no puedes borrar rutas de documento. <br/><br/>Por favor, selecciona un documento raíz para borrar.',
          header: 'Acción no permitida',
          icon: 'pi pi-times-circle',
          rejectVisible: false
        });

        return;
      }

      this.confirmationService.confirm({
        message: 'Si borras este documento, se eliminará todo rastro de notas personales, chunks y embbedings generados.<br/><br/>¿Estás seguro que quieres eliminar el documento?',
        header: 'Atención, pérdida de datos',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

          this.navigatorService.setLoading(true);
          this.documentService.deleteDocument(data.parentDocumentId).subscribe( res => {
            this.loadDocuments();
          });
        },
        reject: () => {

        }
      });

    }

    else {
      this.confirmationService.confirm({
        message: 'Esta acción todavía no está implementada en la herramienta.',
        header: 'Acción no implementada',
        icon: 'pi pi-times-circle',
        rejectVisible: false
      });

    }
    
 
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
