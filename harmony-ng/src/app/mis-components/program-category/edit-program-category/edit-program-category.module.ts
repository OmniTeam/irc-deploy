import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProgramCategoryRoutingModule } from './edit-program-category-routing.module';
import {EditProgramCategoryComponent} from "./edit-program-category.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [EditProgramCategoryComponent],
  imports: [
    CommonModule,
    EditProgramCategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class EditProgramCategoryModule { }
