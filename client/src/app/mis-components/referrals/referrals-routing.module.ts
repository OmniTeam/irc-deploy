import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReferralsComponent} from "./referrals.component";
import {ReferralDashboardComponent} from "./referral-dashboard/referral-dashboard.component";
import {IrcFeedbackComponent} from "./irc-feedback/irc-feedback.component";
import {IrcActivityComponent} from "./irc-activity/irc-activity.component";

const routes: Routes = [
  {
    path: 'list',
    component: ReferralsComponent
  },
  {
    path: 'referral-dashboard',
    component: ReferralDashboardComponent
  },
  {
    path: 'irc-feedback',
    component: IrcFeedbackComponent
  },
  {
    path: 'irc-activity',
    component: IrcActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule {
}
