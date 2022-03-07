import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditProgramStaffComponent} from "./edit-program-staff.component";

const routes: Routes = [
  {
    path: '',
    component: EditProgramStaffComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProgramStaffRoutingModule { }
