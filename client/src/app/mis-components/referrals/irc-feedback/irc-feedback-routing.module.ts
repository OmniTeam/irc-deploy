import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IrcFeedbackComponent} from './irc-feedback.component';

const routes: Routes = [
  {
    path: '',
    component: IrcFeedbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IrcFeedbackRoutingModule {
}
