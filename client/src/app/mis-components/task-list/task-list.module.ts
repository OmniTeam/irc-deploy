import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListRoutingModule } from './task-list-routing.module';
import {TaskListComponent} from "./task-list.component";
import {ComponentsModule} from "../../components/components.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [TaskListComponent],
    imports: [
        CommonModule,
        TaskListRoutingModule,
        ComponentsModule,
        NgxDatatableModule,
        EntityViewTableModule,
        DataTablesModule,
    ]
})
export class TaskListModule { }
