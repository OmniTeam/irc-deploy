import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LinkFormRoutingModule} from './link-form-routing.module';
import {LinkFormComponent} from "./link-form.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [LinkFormComponent],
  imports: [
    CommonModule,
    LinkFormRoutingModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    DataTablesModule
  ]
})
export class LinkFormModule {
}
