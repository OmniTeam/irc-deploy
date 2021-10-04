import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MisFormsComponent} from "./mis-forms.component";

const routes: Routes = [
  {
    path: '',
    component: MisFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisFormsRoutingModule { }
