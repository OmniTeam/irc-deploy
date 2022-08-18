import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditProgramPartnersComponent} from "./edit-program-partners.component";

const routes: Routes = [
  {
    path: '',
    component: EditProgramPartnersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProgramPartnersRoutingModule { }
