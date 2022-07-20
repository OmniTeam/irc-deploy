import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferralEditComponent } from './referral-edit.component';

const routes: Routes = [{ path: '', component: ReferralEditComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralEditRoutingModule { }
