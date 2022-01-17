import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EntityViewTableComponent} from "./entity-view-table.component";

const routes: Routes = [
  {
    path: '',
    component: EntityViewTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityViewTableRoutingModule { }
