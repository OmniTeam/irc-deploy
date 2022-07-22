import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScheduledTasksComponent} from "./scheduled-tasks.component";

const routes: Routes = [
  {
    path: '',
    component: ScheduledTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledTasksRoutingModule { }
