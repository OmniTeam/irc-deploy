import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ComponentsModule} from "../../../components/components.module";
import {DataTablesModule} from "angular-datatables";
import {NgSelectModule} from "@ng-select/ng-select";
import {CommonModule} from "@angular/common";
import {StartLongTermGrantComponent} from "./start-long-term-grant.component";
import {StartLongTermGrantRoutingModule} from "./start-long-term-grant-routing.module";
import {GrantProcessModule} from "../grant-process.module";

@NgModule({
  declarations: [StartLongTermGrantComponent],
  imports: [
    CommonModule,
    StartLongTermGrantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    ComponentsModule,
    DataTablesModule,
    NgSelectModule,
    GrantProcessModule,
  ]
})
export class StartLongTermGrantModule { }
