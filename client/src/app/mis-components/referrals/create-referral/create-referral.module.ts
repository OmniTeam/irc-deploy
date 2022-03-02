import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateReferralRoutingModule } from './create-referral-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {CreateReferralComponent} from './create-referral.component';


@NgModule({
  declarations: [CreateReferralComponent],
    imports: [
        CommonModule,
        CreateReferralRoutingModule,
        ComponentsModule,
        FormsModule,
        NgxDatatableModule,
        HttpClientModule,
        NgSelectModule,
        ReactiveFormsModule,
    ]
})
export class CreateReferralModule { }
