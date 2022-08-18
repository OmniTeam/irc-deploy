import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserRoutingModule } from './edit-user-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {EditUserComponent} from './edit-user.component';


@NgModule({
  declarations: [EditUserComponent],
  imports: [
    CommonModule,
    EditUserRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class EditUserModule { }
