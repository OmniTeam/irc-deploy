import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEntitiesRoutingModule } from './edit-entities-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditEntitiesComponent} from "./edit-entities.component";
import {UiSwitchModule} from "ngx-ui-switch";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [EditEntitiesComponent],
  imports: [
    CommonModule,
    EditEntitiesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UiSwitchModule,
    NgxDatatableModule
  ]
})
export class EditEntitiesModule { }
