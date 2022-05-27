import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrantProcessComponent } from './grant-process.component';

const routes: Routes = [
  {
    path: '',
    component: GrantProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrantProcessRoutingModule { }
