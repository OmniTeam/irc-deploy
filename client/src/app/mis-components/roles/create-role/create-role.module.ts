import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRoleRoutingModule } from './create-role-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {CreateRoleComponent} from './create-role.component';


@NgModule({
  declarations: [CreateRoleComponent],
  imports: [
    CommonModule,
    CreateRoleRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,
  ]
})
export class CreateRoleModule { }
