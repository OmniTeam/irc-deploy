import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTagTypeRoutingModule } from './edit-tag-type-routing.module';
import {EditTagTypeComponent} from "./edit-tag-type.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [EditTagTypeComponent],
  imports: [
    CommonModule,
    EditTagTypeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ]
})
export class EditTagTypeModule { }
