import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditRequestMapsComponent} from "./edit-request-maps.component";

const routes: Routes = [
  {
    path: '',
    component: EditRequestMapsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRequestMapsRoutingModule { }
