import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EntityViewsComponent} from "./entity-views.component";

const routes: Routes = [
  {
    path: '',
    component: EntityViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityViewsRoutingModule { }
