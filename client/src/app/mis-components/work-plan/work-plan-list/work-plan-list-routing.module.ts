import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WorkPlanListComponent} from "./work-plan-list.component";

const routes: Routes = [
  {
    path: '',
    component: WorkPlanListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkPlanListRoutingModule { }
