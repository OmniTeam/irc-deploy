import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditActivityReportComponent } from './edit-activity-report.component';

const routes: Routes = [{ path: '', component: EditActivityReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditActivityReportRoutingModule { }
