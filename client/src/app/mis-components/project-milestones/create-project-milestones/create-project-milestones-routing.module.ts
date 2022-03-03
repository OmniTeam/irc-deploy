import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateProjectMilestonesComponent} from "./create-project-milestones.component";

const routes: Routes = [
  {
    path: '',
    component: CreateProjectMilestonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateProjectMilestonesRoutingModule { }
