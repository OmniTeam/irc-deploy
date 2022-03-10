import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DataViewsComponent} from "./data-views.component";

const routes: Routes = [
  {
    path: '',
    component: DataViewsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataViewsRoutingModule { }
