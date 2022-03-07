import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramStaffRoutingModule } from './program-staff-routing.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ProgramStaffComponent} from "./program-staff.component";


@NgModule({
  declarations: [ProgramStaffComponent],
  imports: [
    CommonModule,
    ProgramStaffRoutingModule,
    NgxDatatableModule
  ]
})
export class ProgramStaffModule { }
