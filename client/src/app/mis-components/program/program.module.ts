import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ProgramComponent} from "./program.component";


@NgModule({
  declarations: [ProgramComponent],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    NgxDatatableModule
  ]
})
export class ProgramModule { }
