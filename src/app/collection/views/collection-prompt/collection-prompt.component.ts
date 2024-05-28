import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { Collection } from '../../models/Collection';
import { CollectionService } from '../../services/collection.service';
import { CollectionProperty } from '../../models/CollectionProperty';
import { CodeModel } from '@ngstack/code-editor';

@Component({
  selector: 'app-collection-prompt',
  templateUrl: './collection-prompt.component.html',
  styleUrls: ['./collection-prompt.component.scss']
})
export class CollectionPromptComponent implements OnInit {

  properties: CollectionProperty[] = [];

  collection: Collection;
  selectedPrompt: any;
  lastSelectedPrompt: any;
  prompts: any[] = [];

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

  

  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private collectionService: CollectionService,
    private navigatorService: NavigatorService,
  ) {
    this.collection = config.data;

    this.prompts = [
      { name: 'Prompt de búsqueda documental', code: 'documentSystemPrompt'},
      { name: 'Prompt de generación de SQL', code: 'sqlSystemPrompt' }
    ];

    this.selectedPrompt = this.prompts[0];
  }



  ngOnInit() {

    this.navigatorService.setLoading(true);
    this.collectionService.findAllPrompts(this.collection.id).subscribe((data) => {
      this.properties = data;


      this.createProperties();

      this.onChangePrompt();
      this.navigatorService.setLoading(false);
    });
  }


  createProperties() {

    this.prompts.forEach(prompt => {
      let property = this.properties.find(p => p.key === prompt.code);
      if (!property) {
        this.properties.push({
          key: prompt.code,
          value: ''
        });
      }
    });

  }

  onChangePrompt() {

    if (this.lastSelectedPrompt) {
      let lastProperty = this.properties.find(p => p.key === this.lastSelectedPrompt.code);
      if (lastProperty) {
        lastProperty.value = this.codeModel.value;
      }
    }

    if (this.selectedPrompt) {
      let property = this.properties.find(p => p.key === this.selectedPrompt.code);
      if (property) {
        this.lastSelectedPrompt = this.selectedPrompt;
        this.setTextInCodeEditor(property.value);
      }
    }

  }

  private setTextInCodeEditor(text: string) : void {
    let newCodeModel = this.codeModel;
    newCodeModel.value = text;

    this.codeModel = JSON.parse(JSON.stringify(newCodeModel)); 
  }

  onSave() {

    this.onChangePrompt();
    this.navigatorService.setLoading(true);
    
    this.collectionService.saveProperties(this.collection.id, this.properties).subscribe(() => {
      this.navigatorService.setLoading(false);
      this.ref.close();
    });
    

  }

  onClose(){
    this.ref.close();
  }


}
