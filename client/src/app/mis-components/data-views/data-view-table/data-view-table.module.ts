import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataViewTableRoutingModule } from './data-view-table-routing.module';
import {DataViewTableComponent} from "./data-view-table.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {EntityViewTableModule} from "../../entity-views/entity-view-table/entity-view-table.module";


@NgModule({
  declarations: [DataViewTableComponent],
    imports: [
        CommonModule,
        DataViewTableRoutingModule,
        NgxDatatableModule,
        EntityViewTableModule
    ]
})
export class DataViewTableModule { }
