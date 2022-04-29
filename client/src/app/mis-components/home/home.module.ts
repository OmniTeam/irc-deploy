import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from "./home.component";
import {ComponentsModule} from "../../components/components.module";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {DateAgoPipe} from "../../pipes/date-ago.pipe";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [HomeComponent, DateAgoPipe],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ComponentsModule,
        NgxDatatableModule,
        EntityViewTableModule,
        DataTablesModule,
    ]
})
export class HomeModule { }
