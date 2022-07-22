import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTagsRoutingModule } from './edit-tags-routing.module';
import {EditTagsComponent} from "./edit-tags.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [EditTagsComponent],
  imports: [
    CommonModule,
    EditTagsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ]
})
export class EditTagsModule { }
