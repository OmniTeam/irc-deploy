import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MessagePagesComponent} from "./message-pages.component";

const routes: Routes = [
  {
    path: '',
    component: MessagePagesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagePagesRoutingModule { }
