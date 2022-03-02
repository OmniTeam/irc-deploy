import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectMilestonesComponent} from "./project-milestones.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectMilestonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMilestonesRoutingModule { }
