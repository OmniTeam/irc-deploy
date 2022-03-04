import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramPartnersRoutingModule } from './create-program-partners-routing.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProgramPartnersComponent} from "./create-program-partners.component";


@NgModule({
  declarations: [CreateProgramPartnersComponent],
  imports: [
    CommonModule,
    CreateProgramPartnersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateProgramPartnersModule { }
