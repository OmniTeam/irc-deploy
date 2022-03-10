import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEntityViewFiltersRoutingModule } from './edit-entity-view-filters-routing.module';
import {EditEntityViewFiltersComponent} from "./edit-entity-view-filters.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [EditEntityViewFiltersComponent],
  imports: [
    CommonModule,
    EditEntityViewFiltersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditEntityViewFiltersModule { }
