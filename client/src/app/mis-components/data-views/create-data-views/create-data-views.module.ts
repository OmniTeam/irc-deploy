import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateDataViewsRoutingModule } from './create-data-views-routing.module';
import {CreateDataViewsComponent} from "./create-data-views.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ModalModule} from "ngx-bootstrap/modal";


@NgModule({
  declarations: [CreateDataViewsComponent],
  imports: [
    CommonModule,
    CreateDataViewsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule
  ]
})
export class CreateDataViewsModule { }
