import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateActivityReportRoutingModule } from './create-activity-report-routing.module';
import { CreateActivityReportComponent } from './create-activity-report.component';


@NgModule({
  declarations: [CreateActivityReportComponent],
  imports: [
    CommonModule,
    CreateActivityReportRoutingModule
  ]
})
export class CreateActivityReportModule { }
