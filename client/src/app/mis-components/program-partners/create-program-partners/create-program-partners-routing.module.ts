import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateProgramPartnersComponent} from "./create-program-partners.component";

const routes: Routes = [
  {
    path: '',
    component: CreateProgramPartnersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateProgramPartnersRoutingModule { }
