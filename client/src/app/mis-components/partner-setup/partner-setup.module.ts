import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerSetupComponent } from './partner-setup.component';
import { PartnerSetupRoutingModule } from './partner-setup-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";

@NgModule({
  declarations: [PartnerSetupComponent],
  imports: [
    CommonModule,
    PartnerSetupRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
    EntityViewTableModule,
  ]
})
export class PartnerSetupModule { }
