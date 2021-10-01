import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import {ComponentsModule} from "../../components/components.module";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ProjectComponent} from "./project.component";


@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
  ]
})
export class ProjectModule { }
