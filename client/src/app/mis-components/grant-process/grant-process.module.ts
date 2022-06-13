import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GrantProcessComponent} from './grant-process.component';
import {ApplicationLetterComponent} from './application-letter.component';
import {PlanningLearningGrantComponent} from './planning-learning-grant.component';
import {OrganizationalInformationComponent} from './organizational-information.component';
import {GrantReportComponent} from './grant-report.component';
import {GrantProcessRoutingModule} from './grant-process-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {EntityViewTableModule} from "../entity-views/entity-view-table/entity-view-table.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {CommentsModule} from "../comments/comments.module";
import {CreateProgramPartnersModule} from "../program-partners/create-program-partners/create-program-partners.module";

@NgModule({
  declarations: [
    GrantProcessComponent,
    ApplicationLetterComponent,
    PlanningLearningGrantComponent,
    OrganizationalInformationComponent,
    GrantReportComponent
  ],
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
        CommentsModule,
        CreateProgramPartnersModule
    ]
})
export class GrantProcessModule {
}
