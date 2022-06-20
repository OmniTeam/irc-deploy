import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartLongTermGrantComponent} from "./start-long-term-grant.component";

const routes: Routes = [
  {
    path: '',
    component: StartLongTermGrantComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartLongTermGrantRoutingModule { }
