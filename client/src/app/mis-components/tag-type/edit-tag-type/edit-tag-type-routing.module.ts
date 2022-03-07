import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditTagTypeComponent} from "./edit-tag-type.component";

const routes: Routes = [
  {
    path: '',
    component: EditTagTypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTagTypeRoutingModule { }
