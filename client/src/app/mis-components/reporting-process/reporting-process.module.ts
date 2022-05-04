import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportingProcessComponent } from './reporting-process.component';
import { ReportingProcessRoutingModule } from './reporting-process-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";

@NgModule({
  declarations: [ReportingProcessComponent],
  imports: [
    CommonModule,
    ReportingProcessRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    EntityViewTableModule,
  ]
})
export class ReportingProcessModule { }
