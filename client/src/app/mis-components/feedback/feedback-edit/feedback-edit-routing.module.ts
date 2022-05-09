import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackEditComponent } from './feedback-edit.component';

const routes: Routes = [{ path: '', component: FeedbackEditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackEditRoutingModule { }
