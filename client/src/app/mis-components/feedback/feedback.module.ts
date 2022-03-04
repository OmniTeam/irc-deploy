import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FeedbackRoutingModule} from './feedback-routing.module';
import {DataTablesModule} from "angular-datatables";
import {FeedbackComponent} from "./feedback.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class FeedbackModule {
}
