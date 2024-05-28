import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Collection } from 'src/app/collection/models/Collection';
import { CollectionService } from '../../services/collection.service';
import { NavigatorService } from 'src/app/core/services/navigator.service';

interface LLM {
  name: string;
  code: string;
  tokens: number;
}


@Component({
  selector: 'app-collection-configuration',
  templateUrl: './collection-configuration.component.html',
  styleUrls: ['./collection-configuration.component.scss']
})
export class CollectionConfigurationComponent implements OnInit {

  llms: LLM[] = [];
  collection: Collection;
  
  selectedLLM: LLM;
  key: string = '';
  noAutocontext: boolean = false;
  onlyDoc: boolean = false;
  onlyCode: boolean = false;
  query: boolean = false;
  deltaTokens: number = 60;
  databaseURL: string = '';
  databaseUsername: string = '';
  databasePassword: string = '';


  constructor(
    private ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private collectionService: CollectionService,
    private navigatorService: NavigatorService,
  ) {
    this.collection = config.data;

    this.llms = [
      { name: 'GPT 3.5-Turbo', code: 'gpt-3.5-turbo', tokens: 16000 },
      { name: 'GPT 4-Turbo', code: 'gpt-4-turbo', tokens: 128000 },
      { name: 'GPT-4o', code: 'gpt-4o', tokens: 128000 },
      { name: 'Mistral 11b', code: 'mistral', tokens: 8000 },
    ];

    this.selectedLLM = this.llms[0];
    this.key = '';
    this.noAutocontext = false;
    this.onlyDoc = false;
    this.onlyCode = false;
    this.query = false;
    this.deltaTokens = 60;
    this.databaseURL = '';
    this.databaseUsername = '';
    this.databasePassword = '';

  }

  ngOnInit() {

    this.navigatorService.setLoading(true);
    this.collectionService.findAllProperties(this.collection.id).subscribe((data) => {

      data.forEach((prop) => {
        if(prop.key == 'llm') this.selectedLLM = this.llms.filter(item => item.code == prop.value)[0];
        if(prop.key == 'apiKey') this.key = prop.value;
        if(prop.key == 'noAutocontext') this.noAutocontext = prop.value == 'true';
        if(prop.key == 'onlyDoc') this.onlyDoc = prop.value == 'true';
        if(prop.key == 'onlyCode') this.onlyCode = prop.value == 'true';
        if(prop.key == 'query') this.query = prop.value == 'true';
        if(prop.key == 'context-ratio') this.deltaTokens = Number(prop.value);
        if(prop.key == 'databaseURL') this.databaseURL = prop.value;
        if(prop.key == 'databaseUsername') this.databaseUsername = prop.value;
        if(prop.key == 'databasePassword') this.databasePassword = prop.value;
      });

      this.navigatorService.setLoading(false);

    });

  }

  onSave() {

    this.navigatorService.setLoading(true);

    let data = [
      { key: 'llm', value: this.selectedLLM.code },
      { key: 'apiKey', value: this.key },
      { key: 'noAutocontext', value: this.noAutocontext.toString() },
      { key: 'onlyDoc', value: this.onlyDoc.toString() },
      { key: 'onlyCode', value: this.onlyCode.toString() },
      { key: 'query', value: this.query.toString() },
      { key: 'context-ratio', value: this.deltaTokens.toString() },
      { key: 'databaseURL', value: this.databaseURL },
      { key: 'databaseUsername', value: this.databaseUsername },
      { key: 'databasePassword', value: this.databasePassword },
    ];
    
    this.collectionService.saveProperties(this.collection.id, data).subscribe(() => {
      this.navigatorService.setLoading(false);
      this.ref.close();
    });


  }

  onClose(){
    this.ref.close();
  }


}
