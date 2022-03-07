import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateEntityViewFiltersComponent} from "./create-entity-view-filters.component";

const routes: Routes = [
  {
    path: '',
    component: CreateEntityViewFiltersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateEntityViewFiltersRoutingModule { }
