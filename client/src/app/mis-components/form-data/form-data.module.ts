import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormDataRoutingModule } from './form-data-routing.module';
import {FormDataComponent} from "./form-data.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [FormDataComponent],
  imports: [
    CommonModule,
    FormDataRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule
  ]
})
export class FormDataModule { }
