import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclGroupMappingRoutingModule } from './acl-group-mapping-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {AclGroupMappingComponent} from './acl-group-mapping.component';
import {ComponentsModule} from "../../components/components.module";


@NgModule({
  declarations: [AclGroupMappingComponent],
  imports: [
    CommonModule,
    AclGroupMappingRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class AclGroupMappingModule { }
