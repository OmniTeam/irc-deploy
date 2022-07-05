import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AclGroupMappingEditComponent} from './acl-group-mapping-edit.component';

const routes: Routes = [
  {
    path: '',
    component: AclGroupMappingEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclGroupMappingEditRoutingModule { }
