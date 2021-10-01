import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectCreateRoutingModule } from './project-create-routing.module';
import {ProjectCreateComponent} from "./project-create.component";
import {ComponentsModule} from "../../../components/components.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ProjectCreateComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectCreateRoutingModule
  ]
})
export class ProjectCreateModule { }
