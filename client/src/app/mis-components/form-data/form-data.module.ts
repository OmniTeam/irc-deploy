import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormDataRoutingModule } from './form-data-routing.module';
import {FormDataComponent} from "./form-data.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "../../components/components.module";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {NgSelectModule, NgOption} from '@ng-select/ng-select';


@NgModule({
  declarations: [FormDataComponent],
    imports: [
        CommonModule,
        FormDataRoutingModule,
        FormsModule,
        NgxDatatableModule,
        ComponentsModule,
        NgbDatepickerModule,
        BsDatepickerModule.forRoot(),
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class FormDataModule { }
