import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRequestMapsRoutingModule } from './create-request-maps-routing.module';
import {CreateRequestMapsComponent} from "./create-request-maps.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [CreateRequestMapsComponent],
  imports: [
    CommonModule,
    CreateRequestMapsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ]
})
export class CreateRequestMapsModule { }
