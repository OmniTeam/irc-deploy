import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormSettingRoutingModule } from './form-setting-routing.module';
import {FormSettingComponent} from "./form-setting.component";
import {ComponentsModule} from "../../components/components.module";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [FormSettingComponent],
  imports: [
    CommonModule,
    FormSettingRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
  ]
})
export class FormSettingModule { }
