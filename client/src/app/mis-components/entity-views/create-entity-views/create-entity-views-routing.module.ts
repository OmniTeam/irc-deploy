import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateEntityViewsComponent} from "./create-entity-views.component";

const routes: Routes = [
  {
    path: '',
    component: CreateEntityViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateEntityViewsRoutingModule { }
