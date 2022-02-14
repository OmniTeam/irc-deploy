import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEntityViewsRoutingModule } from './create-entity-views-routing.module';
import {CreateEntityViewsComponent} from "./create-entity-views.component";
import {DataTablesModule} from "angular-datatables";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [CreateEntityViewsComponent],
  imports: [
    CommonModule,
    CreateEntityViewsRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule
  ]
})
export class CreateEntityViewsModule { }
