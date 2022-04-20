import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LongTermGrantComponent } from './long-term-grant.component';

const routes: Routes = [
  {
    path: '',
    component: LongTermGrantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LongTermGrantRoutingModule { }
