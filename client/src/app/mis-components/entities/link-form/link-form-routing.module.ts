import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LinkFormComponent} from "./link-form.component";

const routes: Routes = [
  {
    path: '',
    component: LinkFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkFormRoutingModule { }
