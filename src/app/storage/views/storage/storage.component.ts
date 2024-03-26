import { Component } from '@angular/core';
import { EmbeddingDocument } from '../../model/EmbeddingDocument';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent {

  documents : EmbeddingDocument[] = [];
  selectedDocument : EmbeddingDocument;

  text : string = 'Hola';


  constructor() {
    this.documents = [
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},


        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},
        {name: 'New York', id: 'NY'},
        {name: 'Rome', id: 'RM'},
        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},

        {name: 'London', id: 'LDN'},
        {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},
                {name: 'Istanbul', id: 'IST'},
        {name: 'Paris', id: 'PRS'},
    ];
}

}
