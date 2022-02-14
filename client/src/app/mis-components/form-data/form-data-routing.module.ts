import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FormDataComponent} from "./form-data.component";

const routes: Routes = [
  {
    path: '',
    component: FormDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormDataRoutingModule { }
