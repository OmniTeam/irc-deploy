import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityViewFiltersRoutingModule } from './entity-view-filters-routing.module';
import {EntityViewFiltersComponent} from "./entity-view-filters.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [EntityViewFiltersComponent],
  imports: [
    CommonModule,
    EntityViewFiltersRoutingModule,
    NgxDatatableModule
  ]
})
export class EntityViewFiltersModule { }
