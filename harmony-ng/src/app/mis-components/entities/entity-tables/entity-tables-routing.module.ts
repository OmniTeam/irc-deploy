import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EntityTablesComponent} from "./entity-tables.component";

const routes: Routes = [
  {
    path: '',
    component: EntityTablesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityTablesRoutingModule { }
