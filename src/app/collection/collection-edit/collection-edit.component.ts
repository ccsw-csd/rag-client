import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Collection } from '../model/Collection';
import { CollectionService } from '../../core/services/collection.service';


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
    private collectionService: CollectionService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,

  ) {}

  ngOnInit(): void{
    this.loading = false;
    if(this.config.data.name != null){
      this.name = this.config.data.name;
      this.description = this.config.data.description;
      this.collection = this.config.data.collection;
    }else{
      this.collection = new Collection();
      this.collection.name = "";
      this.collection.description = "";
    }

    this.setFormGroup();
    
  }

  setFormGroup(){
    if(this.collection.name != null){
    this.profileForm =this.fb.group({
      name: [this.collection.name,Validators.required],
      description: [this.collection.description, Validators.required]
    },{
    });

  }else{
    this.profileForm =this.fb.group({
      name: ["",Validators.required],
      description: ["", Validators.required]
    },{
    });
  }

    this.fillInputs();
  }

  formToCollectionObject(){
    this.collection.name = this.profileForm.value.name;
    this.collection.description = this.profileForm.value.description;
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

      this.collectionService.save(this.collection).subscribe();
      this.closeWindow();
    }
        
  }

  closeWindow(){
    setTimeout(() => {
      this.ref.close({ toRefresh: true });
    }, 100);
  }
}
