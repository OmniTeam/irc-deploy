import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectCreateComponent} from "./project-create.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectCreateRoutingModule { }
