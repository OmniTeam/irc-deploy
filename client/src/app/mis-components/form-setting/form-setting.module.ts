import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormSettingRoutingModule } from './form-setting-routing.module';
import {FormSettingComponent} from "./form-setting.component";


@NgModule({
  declarations: [FormSettingComponent],
  imports: [
    CommonModule,
    FormSettingRoutingModule
  ]
})
export class FormSettingModule { }
