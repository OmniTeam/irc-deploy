import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityViewsRoutingModule } from './entity-views-routing.module';
import {EntityViewsComponent} from "./entity-views.component";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [EntityViewsComponent],
  imports: [
    CommonModule,
    EntityViewsRoutingModule,
    DataTablesModule
  ]
})
export class EntityViewsModule { }
