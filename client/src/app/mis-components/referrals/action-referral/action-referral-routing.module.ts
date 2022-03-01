import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ActionReferralComponent} from './action-referral.component';

const routes: Routes = [
  {
    path: '',
    component: ActionReferralComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionReferralRoutingModule { }
