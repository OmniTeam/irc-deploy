import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {DataTablesModule} from "angular-datatables";
import {UsersComponent} from "./users.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class UsersModule {
}
