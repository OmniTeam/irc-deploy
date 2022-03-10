import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramCategoryRoutingModule } from './program-category-routing.module';
import {ProgramCategoryComponent} from "./program-category.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [ProgramCategoryComponent],
  imports: [
    CommonModule,
    ProgramCategoryRoutingModule,
    NgxDatatableModule
  ]
})
export class ProgramCategoryModule { }
