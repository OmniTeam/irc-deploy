import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReferralsRoutingModule} from './referrals-routing.module';
import {DataTablesModule} from "angular-datatables";
import {ReferralsComponent} from "./referrals.component";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import { ReferralDashboardComponent } from './referral-dashboard/referral-dashboard.component';
import { IrcFeedbackComponent } from './irc-feedback/irc-feedback.component';
import { IrcActivityComponent } from './irc-activity/irc-activity.component';


@NgModule({
  declarations: [ReferralsComponent, ReferralDashboardComponent, IrcFeedbackComponent, IrcActivityComponent],
  imports: [
    CommonModule,
    ReferralsRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class ReferralsModule {
}
