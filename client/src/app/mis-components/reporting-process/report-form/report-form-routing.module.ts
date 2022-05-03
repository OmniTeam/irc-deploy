import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReportFormComponent} from "./report-form.component";

const routes: Routes = [
  {
    path: '',
    component: ReportFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFormRoutingModule { }
