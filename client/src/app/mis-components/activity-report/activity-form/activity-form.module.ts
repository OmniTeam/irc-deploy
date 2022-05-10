import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityFormRoutingModule } from './activity-form-routing.module';
import { ActivityFormComponent } from './activity-form.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {ReactiveFormsModule} from "@angular/forms";
import {SafeUrlPipe} from '../../../pipes/safe-url.pipe';



@NgModule({
  declarations: [ActivityFormComponent, SafeUrlPipe],
    imports: [
        CommonModule,
        ActivityFormRoutingModule,
        NgSelectModule,
        ReactiveFormsModule
    ]
})
export class ActivityFormModule { }
