import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagePagesRoutingModule } from './message-pages-routing.module';
import {MessagePagesComponent} from "./message-pages.component";
import {FormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [MessagePagesComponent],
  imports: [
    CommonModule,
    MessagePagesRoutingModule,
    FormsModule,
    NgxDatatableModule,
    DataTablesModule
  ]
})
export class MessagePagesModule { }
