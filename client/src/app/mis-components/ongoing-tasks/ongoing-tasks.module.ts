import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OngoingTasksRoutingModule } from './ongoing-tasks-routing.module';
import {OngoingTasksComponent} from './ongoing-tasks.component';
import {ComponentsModule} from '../../components/components.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {EntityViewTableModule} from '../entity-views/entity-view-table/entity-view-table.module';
import {DataTablesModule} from 'angular-datatables';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [OngoingTasksComponent],
    imports: [
        CommonModule,
        OngoingTasksRoutingModule,
        ComponentsModule,
        NgxDatatableModule,
        EntityViewTableModule,
        DataTablesModule,
        NgSelectModule,
    ]
})
export class OngoingTasksModule { }
