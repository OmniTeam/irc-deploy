import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditEntityViewFiltersComponent} from "./edit-entity-view-filters.component";

const routes: Routes = [
  {
    path: '',
    component: EditEntityViewFiltersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEntityViewFiltersRoutingModule { }
