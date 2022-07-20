import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralEditRoutingModule } from './referral-edit-routing.module';
import { ReferralEditComponent } from './referral-edit.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';



@NgModule({
  declarations: [ReferralEditComponent],
    imports: [
        CommonModule,
        ReferralEditRoutingModule,
        NgSelectModule,
        ComponentsModule,
        FormsModule,
        NgxDatatableModule,
        HttpClientModule,
        NgSelectModule,
        ReactiveFormsModule,
    ]
})
export class ReferralEditModule { }
