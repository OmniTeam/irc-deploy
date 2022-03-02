import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestMapsRoutingModule } from './request-maps-routing.module';
import {RequestMapsComponent} from "./request-maps.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [RequestMapsComponent],
  imports: [
    CommonModule,
    RequestMapsRoutingModule,
    NgxDatatableModule
  ]
})
export class RequestMapsModule { }
