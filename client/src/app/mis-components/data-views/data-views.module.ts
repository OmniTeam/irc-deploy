import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataViewsRoutingModule } from './data-views-routing.module';
import {DataViewsComponent} from "./data-views.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [DataViewsComponent],
  imports: [
    CommonModule,
    DataViewsRoutingModule,
    NgxDatatableModule,
  ]
})
export class DataViewsModule { }
