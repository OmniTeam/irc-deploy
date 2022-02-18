import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEntitiesRoutingModule } from './create-entities-routing.module';
import {CreateEntitiesComponent} from "./create-entities.component";
import {ComponentsModule} from "../../../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {HttpClientModule} from "@angular/common/http";
import {NgSelectModule} from "@ng-select/ng-select";
import {UiSwitchModule} from "ngx-ui-switch";


@NgModule({
  declarations: [CreateEntitiesComponent],
  imports: [
    CommonModule,
    CreateEntitiesRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
    UiSwitchModule
  ]
})
export class CreateEntitiesModule { }
