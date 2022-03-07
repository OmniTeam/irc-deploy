import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramStaffRoutingModule } from './create-program-staff-routing.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProgramStaffComponent} from "./create-program-staff.component";


@NgModule({
  declarations: [CreateProgramStaffComponent],
  imports: [
    CommonModule,
    CreateProgramStaffRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateProgramStaffModule { }
