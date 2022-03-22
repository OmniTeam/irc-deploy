import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AclGroupMappingComponent} from './acl-group-mapping.component';

const routes: Routes = [
  {
    path: '',
    component: AclGroupMappingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclGroupMappingRoutingModule { }
