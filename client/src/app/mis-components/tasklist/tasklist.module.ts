import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListComponent } from './task-list.component';
import { TaskListRoutingModule } from './task-list-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    TaskListRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
  ]
})
export class TaskListModule { }
