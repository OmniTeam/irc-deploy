import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AclGroupMappingListsRoutingModule} from './acl-group-mapping-lists-routing.module';
import {DataTablesModule} from 'angular-datatables';
import {AclGroupMappingListsComponent} from './acl-group-mapping-lists.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormNamePipe} from '../../form-name-pipe';


@NgModule({
  declarations: [AclGroupMappingListsComponent, FormNamePipe],
  imports: [
    CommonModule,
    AclGroupMappingListsRoutingModule,
    DataTablesModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class AclGroupMappingListsModule {
}
