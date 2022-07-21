import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchiveComponent } from './archive.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [ArchiveComponent],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    EntityViewTableModule,
    DataTablesModule
  ]
})
export class ArchiveModule { }
