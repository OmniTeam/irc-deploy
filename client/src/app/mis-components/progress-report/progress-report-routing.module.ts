import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProgressReportComponent} from "./progress-report.component";

const routes: Routes = [
  {
    path: '',
    component: ProgressReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressReportRoutingModule { }
