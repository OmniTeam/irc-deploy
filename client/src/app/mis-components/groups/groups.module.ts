import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GroupsRoutingModule} from './groups-routing.module';
import {DataTablesModule} from "angular-datatables";
import {GroupsComponent} from "./groups.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [GroupsComponent],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class GroupsModule {
}
