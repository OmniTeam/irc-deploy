import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackEditRoutingModule } from './feedback-edit-routing.module';
import { FeedbackEditComponent } from './feedback-edit.component';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';




@NgModule({
  declarations: [FeedbackEditComponent],
  imports: [
    CommonModule,
    FeedbackEditRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    HttpClientModule,
  ]
})
export class FeedbackEditModule { }
