import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditProjectMilestonesComponent} from "./edit-project-milestones.component";

const routes: Routes = [
  {
    path: '',
    component: EditProjectMilestonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProjectMilestonesRoutingModule { }
