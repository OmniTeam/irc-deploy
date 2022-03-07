import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateProjectMilestonesRoutingModule } from './create-project-milestones-routing.module';
import {CreateProjectMilestonesComponent} from "./create-project-milestones.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [CreateProjectMilestonesComponent],
  imports: [
    CommonModule,
    CreateProjectMilestonesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class CreateProjectMilestonesModule { }
