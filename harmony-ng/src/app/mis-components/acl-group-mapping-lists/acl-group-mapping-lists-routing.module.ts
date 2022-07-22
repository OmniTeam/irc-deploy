import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AclGroupMappingListsComponent} from "./acl-group-mapping-lists.component";

const routes: Routes = [
  {
    path: '',
    component: AclGroupMappingListsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclGroupMappingListsRoutingModule {
}
