import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ProgramComponent} from "./program.component";
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [ProgramComponent],
  imports: [
    CommonModule,
    ProgramRoutingModule,
    NgxDatatableModule,
    ComponentsModule
  ]
})
export class ProgramModule { }
