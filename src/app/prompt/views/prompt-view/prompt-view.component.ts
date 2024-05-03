import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Prompt } from '../../models/Prompt';
import { PromptService } from '../../services/prompt.service';
import { Person } from '../../models/Person';
import { PromptStats } from '../../models/PromptStats';

@Component({
  selector: 'app-prompt-view',
  templateUrl: './prompt-view.component.html',
  styleUrls: ['./prompt-view.component.scss']
})
export class PromptViewComponent implements OnInit {

  prompt: Prompt;

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private promptService: PromptService,
  ) {

    this.prompt = {} as Prompt;

  }


  ngOnInit(): void {

    this.promptService.getById(this.config.data.id).subscribe((data: Prompt) => {
      this.prompt = data;


      this.promptService.view(this.prompt.id).subscribe((data: PromptStats) => {
        this.prompt.likes = data.likes;
        this.prompt.views = data.views;
        this.prompt.userLiked = data.userLiked;
        });
    });

  }

  getLikes(): string {
    if (this.prompt.likes > 99) return '99+';
    else return ''+this.prompt.likes; 
  }

  getLikeIcon(): string {
    if (this.prompt.userLiked) return 'pi-thumbs-up-fill';
    else return 'pi-thumbs-up';
  }
  
  onLike() {
    this.promptService.like(this.prompt.id).subscribe((data: PromptStats) => {
      this.prompt.likes = data.likes;
      this.prompt.views = data.views;
      this.prompt.userLiked = data.userLiked;
    });
  }

  displayName(person: Person): string{
    if (person == null) return '';
    return person.name + ' ' + person.lastname;
  }

  getAbbreviatedName(name: string): string {
    if (name == null) return '';
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }

  onClose() {
    this.ref.close({});
  }

}
