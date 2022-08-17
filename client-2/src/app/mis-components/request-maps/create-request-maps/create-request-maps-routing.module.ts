import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateRequestMapsComponent} from "./create-request-maps.component";

const routes: Routes = [
  {
    path: '',
    component: CreateRequestMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRequestMapsRoutingModule { }
