import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramRoutingModule } from './create-program-routing.module';
import {CreateProgramComponent} from "./create-program.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CreateProgramComponent],
  imports: [
    CommonModule,
    CreateProgramRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CreateProgramModule { }
