import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateFeedbackComponent} from './create-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: CreateFeedbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateFeedbackRoutingModule { }
