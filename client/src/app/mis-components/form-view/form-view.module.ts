import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormViewComponent } from './form-view.component';
import { FormViewRoutingModule } from './form-view-routing.module';
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../components/components.module";
import {DataTablesModule} from "angular-datatables";

@NgModule({
  declarations: [FormViewComponent],
  imports: [
    CommonModule,
    FormViewRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
  ]
})
export class FormViewModule { }
