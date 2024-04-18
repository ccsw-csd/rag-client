import { Component } from '@angular/core';
import { DocumentFile } from '../../model/DocumentFile';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {

  uploadedFiles: any[] = [];
  tokensDoc: number = 1000;
  tokensCode: number = 4000;

  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private documentService: DocumentService,
    private navigatorService: NavigatorService,

  ) {
    //this.document = new DocumentFile();
  }


  onSave(){
    /*
    this.navigatorService.setLoading(true);
    this.documentService.generateChunks(this.document.id, this.tokens).subscribe(() => {
      this.ref.close({ toRefresh: true});
    });
    */
  }

  closeWindow(){
    this.ref.close({ toRefresh: false });
  }

  onUpload(event) {
    console.log('onUpload', event);
  }
}
