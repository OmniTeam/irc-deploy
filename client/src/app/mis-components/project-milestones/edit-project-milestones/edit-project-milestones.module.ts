import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EditProjectMilestonesRoutingModule} from './edit-project-milestones-routing.module';
import {EditProjectMilestonesComponent} from "./edit-project-milestones.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [EditProjectMilestonesComponent],
  imports: [
    CommonModule,
    EditProjectMilestonesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditProjectMilestonesModule {
}
