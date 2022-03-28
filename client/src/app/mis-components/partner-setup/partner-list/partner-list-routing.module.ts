import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PartnerListComponent} from "./partner-list.component";

const routes: Routes = [
  {
    path: '',
    component: PartnerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerListRoutingModule { }
