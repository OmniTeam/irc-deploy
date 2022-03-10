import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DataViewTableComponent} from "./data-view-table.component";

const routes: Routes = [
  {
    path: '',
    component: DataViewTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataViewTableRoutingModule { }
