import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditActivityReportRoutingModule } from './edit-activity-report-routing.module';
import { EditActivityReportComponent } from './edit-activity-report.component';


@NgModule({
  declarations: [EditActivityReportComponent],
  imports: [
    CommonModule,
    EditActivityReportRoutingModule
  ]
})
export class EditActivityReportModule { }
