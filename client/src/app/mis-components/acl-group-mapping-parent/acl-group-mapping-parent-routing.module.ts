import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AclGroupMappingParentComponent} from './acl-group-mapping-parent.component';

const routes: Routes = [
  {
    path: '',
    component: AclGroupMappingParentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclGroupMappingParentRoutingModule { }
