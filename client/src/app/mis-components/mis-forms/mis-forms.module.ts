import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisFormsRoutingModule } from './mis-forms-routing.module';
import {MisFormsComponent} from "./mis-forms.component";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [MisFormsComponent],
  imports: [
    CommonModule,
    MisFormsRoutingModule,
    FormsModule,
    NgxDatatableModule,
    DataTablesModule
  ]
})
export class MisFormsModule { }
