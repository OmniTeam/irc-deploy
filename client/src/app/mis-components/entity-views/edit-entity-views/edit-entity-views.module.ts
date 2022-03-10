import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEntityViewsRoutingModule } from './edit-entity-views-routing.module';
import {EditEntityViewsComponent} from "./edit-entity-views.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [EditEntityViewsComponent],
  imports: [
    CommonModule,
    EditEntityViewsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDatatableModule
  ]
})
export class EditEntityViewsModule { }
