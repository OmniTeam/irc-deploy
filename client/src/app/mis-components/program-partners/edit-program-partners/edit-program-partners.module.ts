import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProgramPartnersRoutingModule } from './edit-program-partners-routing.module';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditProgramPartnersComponent} from "./edit-program-partners.component";


@NgModule({
  declarations: [EditProgramPartnersComponent],
  imports: [
    CommonModule,
    EditProgramPartnersRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EditProgramPartnersModule { }
