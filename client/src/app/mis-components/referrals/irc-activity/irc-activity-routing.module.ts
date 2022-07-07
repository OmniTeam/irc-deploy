import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IrcActivityComponent} from './irc-activity.component';

const routes: Routes = [
  {
    path: '',
    component: IrcActivityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IrcActivityRoutingModule {
}
