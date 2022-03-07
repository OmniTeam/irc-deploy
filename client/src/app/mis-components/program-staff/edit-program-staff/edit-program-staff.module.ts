import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProgramStaffRoutingModule } from './edit-program-staff-routing.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditProgramStaffComponent} from "./edit-program-staff.component";


@NgModule({
  declarations: [EditProgramStaffComponent],
  imports: [
    CommonModule,
    EditProgramStaffRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EditProgramStaffModule { }
