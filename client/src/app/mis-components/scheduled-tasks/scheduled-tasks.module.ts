import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduledTasksRoutingModule } from './scheduled-tasks-routing.module';
import {ScheduledTasksComponent} from "./scheduled-tasks.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [ScheduledTasksComponent],
  imports: [
    CommonModule,
    ScheduledTasksRoutingModule,
    NgxDatatableModule
  ]
})
export class ScheduledTasksModule { }
