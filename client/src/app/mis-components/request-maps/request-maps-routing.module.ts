import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RequestMapsComponent} from "./request-maps.component";

const routes: Routes = [
  {
    path: '',
    component: RequestMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestMapsRoutingModule { }
