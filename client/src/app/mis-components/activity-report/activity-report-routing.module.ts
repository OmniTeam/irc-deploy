import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActivityReportComponent} from "./activity-report.component";

const routes: Routes = [
  {
    path: '',
  component: ActivityReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityReportRoutingModule { }
