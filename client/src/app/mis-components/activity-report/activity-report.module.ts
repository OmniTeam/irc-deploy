import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityReportRoutingModule } from './activity-report-routing.module';
import { ActivityReportComponent } from './activity-report.component';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [ActivityReportComponent],
  imports: [
    CommonModule,
    ActivityReportRoutingModule,
    NgxDatatableModule
  ]
})
export class ActivityReportModule { }
