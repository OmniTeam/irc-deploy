import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateEntitiesComponent} from "./create-entities.component";

const routes: Routes = [
  {
    path: '',
    component: CreateEntitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateEntitiesRoutingModule { }
