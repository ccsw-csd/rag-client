import { Component } from '@angular/core';
import { Document } from '../../model/Document';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentService } from '../../services/document.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';

@Component({
  selector: 'app-chunk-dialog',
  templateUrl: './chunk-dialog.component.html',
  styleUrls: ['./chunk-dialog.component.scss']
})
export class ChunkDialogComponent {

  document: Document;
  tokens: number = 1000;

  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private documentService: DocumentService,
    private navigatorService: NavigatorService,

  ) {
    this.document = config.data.document;
  }


  onSave(){
    this.navigatorService.setLoading(true);
    this.documentService.generateChunks(this.document.id, this.tokens).subscribe(() => {
      this.ref.close({ toRefresh: true});
    });

  }

  closeWindow(){
    this.ref.close({ toRefresh: false });
  }

}
