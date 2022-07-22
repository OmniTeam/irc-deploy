import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProgramPartnersComponent} from "./program-partners.component";

const routes: Routes = [
  {
    path: '',
    component: ProgramPartnersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramPartnersRoutingModule { }
