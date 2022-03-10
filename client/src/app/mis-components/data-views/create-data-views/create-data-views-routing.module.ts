import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateDataViewsComponent} from "./create-data-views.component";

const routes: Routes = [
  {
    path: '',
    component: CreateDataViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateDataViewsRoutingModule { }
