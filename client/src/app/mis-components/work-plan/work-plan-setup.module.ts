import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkPlanComponent } from './work-plan-setup.component';
import { WorkPlanSetupRoutingModule } from './work-plan-setup-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [WorkPlanComponent],
    imports: [
        CommonModule,
        WorkPlanSetupRoutingModule,
        FormsModule,
        NgxDatatableModule,
        ComponentsModule,
        DataTablesModule,
        EntityViewTableModule,
        NgSelectModule,
    ]
})
export class WorkPlanSetupModule { }
