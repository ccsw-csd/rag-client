import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Collection } from '../model/Collection';


@Component({
  selector: 'app-collection-edit',
  templateUrl: './collection-edit.component.html',
  styleUrls: ['./collection-edit.component.scss']
})
export class CollectionEditComponent {

  collection:Collection;
  name:string;
  description:string;
  loading:boolean;
  profileForm :any;

  constructor(
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,

  ) {}

  ngOnInit(): void{
    this.loading = false;
    this.name = this.config.data.name;
    this.description = this.config.data.description;
    this.collection = this.config.data.collection;
    this.setFormGroup();
  }

  setFormGroup(){
    this.profileForm =this.fb.group({
      name: [this.collection.name,Validators.required],
      description: [this.collection.description, Validators.required]
    },{
    });

    this.fillInputs();
  }

  formToCollectionObject(){
    this.collection.name = this.profileForm.get('name').value;
    this.collection.description = this.profileForm.get('description').value;
  }

  fillInputs(){
    this.profileForm.patchValue({
      name: this.name,
      description: this.description
    });
  }

  onSave(){
    if(this.profileForm.valid){
      this.loading = true;
      this.formToCollectionObject();
      this.name = this.profileForm.get('name').value;
    }
        
  }

  closeWindow(){
    this.ref.close();
  }
}
