import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditEntityViewsComponent} from "./edit-entity-views.component";

const routes: Routes = [
  {
    path: '',
    component: EditEntityViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEntityViewsRoutingModule { }
