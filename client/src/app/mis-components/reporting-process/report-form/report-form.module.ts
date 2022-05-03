import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportFormComponent } from './report-form.component';
import { ReportFormRoutingModule } from './report-form-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../../entity-views/entity-view-table/entity-view-table.module";
import {CommentsModule} from "../../comments/comments.module";

@NgModule({
  declarations: [ReportFormComponent],
  imports: [
    CommonModule,
    ReportFormRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
    EntityViewTableModule,
    CommentsModule,
  ]
})
export class ReportFormModule { }
