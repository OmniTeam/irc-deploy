import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MisFormsRoutingModule} from './mis-forms-routing.module';
import {MisFormsComponent} from "./mis-forms.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReplacePipe} from "../../replace-pipe";


@NgModule({
    declarations: [MisFormsComponent, ReplacePipe],
    imports: [
        CommonModule,
        MisFormsRoutingModule,
        FormsModule,
        NgxDatatableModule,
        ReactiveFormsModule
    ]
})
export class MisFormsModule {
}
