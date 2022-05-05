import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportingProcessComponent} from "./reporting-process.component";

const routes: Routes = [
  {
    path: '',
    component: ReportingProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingProcessRoutingModule { }
