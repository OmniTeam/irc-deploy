import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from './entities-routing.module';
import {EntitiesComponent} from "./entities.component";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [EntitiesComponent],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule
  ]
})
export class EntitiesModule { }
