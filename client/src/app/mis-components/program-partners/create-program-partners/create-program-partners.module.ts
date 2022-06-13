import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramPartnersRoutingModule } from './create-program-partners-routing.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProgramPartnersComponent} from "./create-program-partners.component";
import {PhonePipe} from "../../../pipes/phone.pipe";

@NgModule({
  declarations: [CreateProgramPartnersComponent, PhonePipe],
  exports: [
    PhonePipe
  ],
  imports: [
    CommonModule,
    CreateProgramPartnersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateProgramPartnersModule { }
