import { Component } from '@angular/core';
import { DocumentFile } from '../../model/DocumentFile';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { DocumentService } from '../../services/document.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FileRemoveEvent, FileSelectEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {

  selectedFiles: File[] = [];
  uploadedFiles: any[] = [];
  tokensDoc: number = 1000;
  tokensCode: number = 4000;

  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private authService: AuthService,
    private documentService: DocumentService,
    private navigatorService: NavigatorService,

  ) {
    //this.document = new DocumentFile();
  }

  onSelect(event: FileSelectEvent) {

    this.selectedFiles = event.currentFiles;

    console.log(this.selectedFiles)

  }

  onRemove(event: FileRemoveEvent) {

    this.selectedFiles = this.selectedFiles.filter(file => file.name !== event.file.name);

    console.log(this.selectedFiles)
  }

  onSave(){

    let collectionId = this.authService.getProperty("selected-collection").id;

    console.log(this.uploadedFiles);

    let formData = new FormData;
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append("file", this.selectedFiles[i]);
    }

    formData.append("tokensDocumentation", ''+this.tokensDoc);
    formData.append("tokensCode", ''+this.tokensCode);

    this.navigatorService.setLoading(true);
    this.documentService.uploadDocuments(collectionId, formData).subscribe(() => {
      this.ref.close({ toRefresh: true});
    });
    
  }

  closeWindow(){
    this.ref.close({ toRefresh: false });
  }

  onUpload(event) {
    console.log('onUpload', event);
  }
}
