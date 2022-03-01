import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionReferralRoutingModule } from './action-referral-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {ActionReferralComponent} from './action-referral.component';


@NgModule({
  declarations: [ActionReferralComponent],
  imports: [
    CommonModule,
    ActionReferralRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,

  ]
})
export class ActionReferralModule { }
