import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisFormsRoutingModule } from './mis-forms-routing.module';
import {MisFormsComponent} from "./mis-forms.component";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";


@NgModule({
  declarations: [MisFormsComponent],
  imports: [
    CommonModule,
    MisFormsRoutingModule,
    FormsModule,
    NgxDatatableModule
  ]
})
export class MisFormsModule { }
