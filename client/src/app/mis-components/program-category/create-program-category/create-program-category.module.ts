import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProgramCategoryRoutingModule } from './create-program-category-routing.module';
import {CreateProgramCategoryComponent} from "./create-program-category.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [CreateProgramCategoryComponent],
  imports: [
    CommonModule,
    CreateProgramCategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class CreateProgramCategoryModule { }
