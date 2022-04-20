import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityViewFiltersRoutingModule } from './entity-view-filters-routing.module';
import {EntityViewFiltersComponent} from "./entity-view-filters.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [EntityViewFiltersComponent],
  imports: [
    CommonModule,
    EntityViewFiltersRoutingModule,
    NgxDatatableModule,
    NgSelectModule
  ]
})
export class EntityViewFiltersModule { }
