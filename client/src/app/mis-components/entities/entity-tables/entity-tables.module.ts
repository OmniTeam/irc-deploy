import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityTablesRoutingModule } from './entity-tables-routing.module';
import {EntityTablesComponent} from "./entity-tables.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {EntityViewTableModule} from "../../entity-views/entity-view-table/entity-view-table.module";


@NgModule({
  declarations: [EntityTablesComponent],
  imports: [
    CommonModule,
    EntityTablesRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    EntityViewTableModule
  ]
})
export class EntityTablesModule { }
