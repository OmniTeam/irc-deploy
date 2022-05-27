import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from "./home.component";
import {ComponentsModule} from "../../components/components.module";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ComponentsModule,
    EntityViewTableModule,
    NgxDatatableModule
  ]
})
export class HomeModule { }
