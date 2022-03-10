import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataViewTableRoutingModule } from './data-view-table-routing.module';
import {DataViewTableComponent} from "./data-view-table.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [DataViewTableComponent],
  imports: [
    CommonModule,
    DataViewTableRoutingModule,
    NgxDatatableModule
  ]
})
export class DataViewTableModule { }
