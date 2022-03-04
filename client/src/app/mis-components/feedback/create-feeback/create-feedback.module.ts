import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateFeedbackRoutingModule } from './create-feedback-routing.module';
import {ComponentsModule} from '../../../components/components.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {CreateFeedbackComponent} from './create-feedback.component';


@NgModule({
  declarations: [CreateFeedbackComponent],
    imports: [
        CommonModule,
        CreateFeedbackRoutingModule,
        ComponentsModule,
        FormsModule,
        NgxDatatableModule,
        HttpClientModule,
        NgSelectModule,
        ReactiveFormsModule,
    ]
})
export class CreateFeedbackModule { }
