import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclGroupMappingParentRoutingModule } from './acl-group-mapping-parent-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {AclGroupMappingParentComponent} from './acl-group-mapping-parent.component';
import {ComponentsModule} from '../../components/components.module';


@NgModule({
  declarations: [AclGroupMappingParentComponent],
  imports: [
    CommonModule,
    AclGroupMappingParentRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class AclGroupMappingParentModule { }
