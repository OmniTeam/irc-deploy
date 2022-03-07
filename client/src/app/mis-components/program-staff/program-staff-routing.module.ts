import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProgramStaffComponent} from "./program-staff.component";

const routes: Routes = [
  {
    path: '',
    component: ProgramStaffComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramStaffRoutingModule { }
