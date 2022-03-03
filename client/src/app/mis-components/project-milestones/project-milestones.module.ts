import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectMilestonesRoutingModule } from './project-milestones-routing.module';
import {ProjectMilestonesComponent} from "./project-milestones.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [ProjectMilestonesComponent],
  imports: [
    CommonModule,
    ProjectMilestonesRoutingModule,
    NgxDatatableModule
  ]
})
export class ProjectMilestonesModule { }
