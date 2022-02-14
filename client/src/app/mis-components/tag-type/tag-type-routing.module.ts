import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TagTypeComponent} from "./tag-type.component";

const routes: Routes = [
  {
    path: '',
    component: TagTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagTypeRoutingModule { }
