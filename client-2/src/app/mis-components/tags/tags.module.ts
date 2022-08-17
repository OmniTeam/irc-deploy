import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import {DataTablesModule} from "angular-datatables";
import {TagsComponent} from "./tags.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {ComponentsModule} from "../../components/components.module";
import {EntityViewTableModule} from '../entity-views/entity-view-table/entity-view-table.module';


@NgModule({
  declarations: [TagsComponent],
    imports: [
        CommonModule,
        TagsRoutingModule,
        DataTablesModule,
        NgxDatatableModule,
        ReactiveFormsModule,
        NgSelectModule,
        ComponentsModule,
        EntityViewTableModule
    ]
})
export class TagsModule { }
