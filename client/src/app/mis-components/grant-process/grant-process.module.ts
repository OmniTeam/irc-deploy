import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrantProcessComponent } from './grant-process.component';
import { ApplicationLetterComponent } from './application-letter.component';
import { PlanningLearningGrantComponent } from './planning-learning-grant.component';
import { GrantProcessRoutingModule } from './grant-process-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [GrantProcessComponent, ApplicationLetterComponent, PlanningLearningGrantComponent],
  imports: [
    CommonModule,
    GrantProcessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
    EntityViewTableModule,
    NgSelectModule,
  ]
})
export class GrantProcessModule { }
