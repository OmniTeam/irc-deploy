import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditDataViewsRoutingModule } from './edit-data-views-routing.module';
import {EditDataViewsComponent} from "./edit-data-views.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [EditDataViewsComponent],
  imports: [
    CommonModule,
    EditDataViewsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule
  ]
})
export class EditDataViewsModule { }
