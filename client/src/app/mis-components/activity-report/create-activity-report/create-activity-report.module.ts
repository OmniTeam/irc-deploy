import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateActivityReportRoutingModule } from './create-activity-report-routing.module';
import { CreateActivityReportComponent } from './create-activity-report.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CreateActivityReportComponent],
  imports: [
    CommonModule,
    CreateActivityReportRoutingModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class CreateActivityReportModule { }
