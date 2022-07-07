import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OngoingTasksComponent} from "./ongoing-tasks.component";

const routes: Routes = [
  {
    path: '',
    component: OngoingTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OngoingTasksRoutingModule { }
