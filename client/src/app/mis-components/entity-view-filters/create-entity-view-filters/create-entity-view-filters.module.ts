import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEntityViewFiltersRoutingModule } from './create-entity-view-filters-routing.module';
import {CreateEntityViewFiltersComponent} from "./create-entity-view-filters.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [CreateEntityViewFiltersComponent],
  imports: [
    CommonModule,
    CreateEntityViewFiltersRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CreateEntityViewFiltersModule { }
