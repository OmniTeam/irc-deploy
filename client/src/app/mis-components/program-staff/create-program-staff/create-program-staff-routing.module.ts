import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateProgramStaffComponent} from "./create-program-staff.component";

const routes: Routes = [
  {
    path: '',
    component: CreateProgramStaffComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateProgramStaffRoutingModule { }
