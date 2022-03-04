import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProgramRoutingModule } from './edit-program-routing.module';
import {EditProgramComponent} from "./edit-program.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [EditProgramComponent],
  imports: [
    CommonModule,
    EditProgramRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditProgramModule { }
