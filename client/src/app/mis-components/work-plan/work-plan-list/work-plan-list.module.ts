import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkPlanListComponent } from './work-plan-list.component';
import { WorkPlanListRoutingModule } from './work-plan-list-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../../entity-views/entity-view-table/entity-view-table.module";

@NgModule({
  declarations: [WorkPlanListComponent],
  imports: [
    CommonModule,
    WorkPlanListRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
    EntityViewTableModule,
  ]
})
export class WorkPlanListModule { }
