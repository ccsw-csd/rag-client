import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromptService } from './prompt.service';
import { Prompt } from '../models/Prompt';

@Injectable()
export class PromptLoaderResolverService implements Resolve<Prompt> {
  constructor(private http: HttpClient,
    private promptService: PromptService,) { }

  /**
   * resolve method
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot): Observable<Prompt> {
    const promptId = route.params['id'];
    return this.promptService.getById(promptId);
  }

}