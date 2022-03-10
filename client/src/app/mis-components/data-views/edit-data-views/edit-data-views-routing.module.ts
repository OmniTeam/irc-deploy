import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditDataViewsComponent} from "./edit-data-views.component";

const routes: Routes = [
  {
    path: '',
    component: EditDataViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditDataViewsRoutingModule { }
