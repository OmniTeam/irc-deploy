import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkPlanComponent} from "./work-plan-setup.component";

const routes: Routes = [
  {
    path: '',
    component: WorkPlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPlanSetupRoutingModule { }
