import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionFeedbackRoutingModule } from './action-feedback-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {ActionFeedbackComponent} from './action-feedback.component';


@NgModule({
  declarations: [ActionFeedbackComponent],
  imports: [
    CommonModule,
    ActionFeedbackRoutingModule,
    ComponentsModule,
    FormsModule,
    NgxDatatableModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule,

  ]
})
export class ActionFeedbackModule { }
