import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityFormComponent } from './activity-form.component';

const routes: Routes = [{ path: '', component: ActivityFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityFormRoutingModule { }
