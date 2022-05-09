import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditActivityReportRoutingModule } from './edit-activity-report-routing.module';
import { EditActivityReportComponent } from './edit-activity-report.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [EditActivityReportComponent],
  imports: [
    CommonModule,
    EditActivityReportRoutingModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class EditActivityReportModule { }
