import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LongTermGrantComponent } from './long-term-grant.component';
import {StartLongTermGrantComponent} from "./start-long-term-grant.component";

const routes: Routes = [
  {
    path: '',
    component: LongTermGrantComponent
  },
  {
    path: '/start',
    component: StartLongTermGrantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LongTermGrantRoutingModule { }
