import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasklistComponent } from './tasklist.component';
import { TasklistRoutingModule } from './tasklist-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [TasklistComponent],
  imports: [
    CommonModule,
    TasklistRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
  ]
})
export class TaskListModule { }
