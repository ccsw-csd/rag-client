import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private messageService: MessageService) { }


  public error(text: string) : void {
    this.messageService.add({severity:'error', summary: 'Error', detail: text});
  }

  showMessage(message: string) {
    this.messageService.add({severity:'success', summary: 'Ok', detail: message});
  }

}
