import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramPartnersRoutingModule } from './program-partners-routing.module';
import {ProgramPartnersComponent} from "./program-partners.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [ProgramPartnersComponent],
  imports: [
    CommonModule,
    ProgramPartnersRoutingModule,
    NgxDatatableModule
  ]
})
export class ProgramPartnersModule { }
