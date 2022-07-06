import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AclGroupMappingEditRoutingModule } from './acl-group-mapping-edit-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {AclGroupMappingEditComponent} from './acl-group-mapping-edit.component';
import {ComponentsModule} from '../../components/components.module';
import {FormNamePipe} from '../../form-name-pipe';


@NgModule({
  declarations: [AclGroupMappingEditComponent],
  imports: [
    CommonModule,
    AclGroupMappingEditRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class AclGroupMappingEditModule { }
