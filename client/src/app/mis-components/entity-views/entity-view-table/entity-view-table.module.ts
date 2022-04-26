import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityViewTableRoutingModule } from './entity-view-table-routing.module';
import {DataTablesModule} from 'angular-datatables';
import {EntityViewTableComponent} from './entity-view-table.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ReplacePipe} from '../../../replace-pipe';


@NgModule({
  declarations: [EntityViewTableComponent, ReplacePipe],
  exports: [
    ReplacePipe
  ],
  imports: [
    CommonModule,
    EntityViewTableRoutingModule,
    NgxDatatableModule,
    DataTablesModule
  ]
})
export class EntityViewTableModule { }
