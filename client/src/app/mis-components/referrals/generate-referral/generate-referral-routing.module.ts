import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GenerateReferralComponent} from "./generate-referral.component";

const routes: Routes = [
  {
    path: '',
    component: GenerateReferralComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerateReferralRoutingModule { }
