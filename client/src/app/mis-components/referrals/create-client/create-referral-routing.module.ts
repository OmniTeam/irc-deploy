import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateReferralComponent} from './create-referral.component';

const routes: Routes = [
  {
    path: '',
    component: CreateReferralComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateReferralRoutingModule { }
