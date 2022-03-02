import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PartnerSetupComponent} from "./partner-setup.component";

const routes: Routes = [
  {
    path: '',
    component: PartnerSetupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartnerSetupRoutingModule { }
