import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {GenerateReferralRoutingModule} from "./generate-referral-routing.module";
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {GenerateReferralComponent} from "./generate-referral.component";


@NgModule({
  declarations: [GenerateReferralComponent],
  imports: [
    CommonModule,
    GenerateReferralRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class GenerateReferralModule { }
