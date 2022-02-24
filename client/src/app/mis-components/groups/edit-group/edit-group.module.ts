import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditGroupRoutingModule } from './edit-group-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {EditGroupComponent} from './edit-group.component';


@NgModule({
  declarations: [EditGroupComponent],
  imports: [
    CommonModule,
    EditGroupRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class EditGroupModule { }
