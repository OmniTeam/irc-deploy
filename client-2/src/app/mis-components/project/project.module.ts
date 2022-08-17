import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import {ComponentsModule} from "../../components/components.module";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ProjectComponent} from "./project.component";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    DataTablesModule
  ]
})
export class ProjectModule { }
