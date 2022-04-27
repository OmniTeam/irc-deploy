import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateActivityReportComponent} from "./create-activity-report.component";

const routes: Routes = [
  {
    path: '',
    component: CreateActivityReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateActivityReportRoutingModule { }
