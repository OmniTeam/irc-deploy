import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagTypeRoutingModule } from './tag-type-routing.module';
import {DataTablesModule} from "angular-datatables";
import {TagTypeComponent} from "./tag-type.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [TagTypeComponent],
  imports: [
    CommonModule,
    TagTypeRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ]
})
export class TagTypeModule { }
