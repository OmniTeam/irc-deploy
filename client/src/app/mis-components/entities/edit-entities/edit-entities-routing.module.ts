import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditEntitiesComponent} from "./edit-entities.component";

const routes: Routes = [
  {
    path: '',
    component: EditEntitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditEntitiesRoutingModule { }
