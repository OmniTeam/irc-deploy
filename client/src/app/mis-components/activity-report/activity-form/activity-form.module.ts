import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityFormRoutingModule } from './activity-form-routing.module';
import { ActivityFormComponent } from './activity-form.component';


@NgModule({
  declarations: [ActivityFormComponent],
  imports: [
    CommonModule,
    ActivityFormRoutingModule
  ]
})
export class ActivityFormModule { }
