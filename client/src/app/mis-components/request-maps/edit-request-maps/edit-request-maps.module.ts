import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EditRequestMapsRoutingModule} from './edit-request-maps-routing.module';
import {EditRequestMapsComponent} from "./edit-request-maps.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [EditRequestMapsComponent],
  imports: [
    CommonModule,
    EditRequestMapsRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class EditRequestMapsModule {
}
