import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActionFeedbackComponent} from './action-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: ActionFeedbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionFeedbackRoutingModule { }
