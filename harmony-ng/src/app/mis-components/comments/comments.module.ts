import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommentsComponent } from './comments.component';
import { CommentsRoutingModule } from './comments-routing.module';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [CommentsComponent],
  exports: [
    CommentsComponent
  ],
  imports: [
    CommonModule,
    CommentsRoutingModule,
    FormsModule,
  ]
})
export class CommentsModule { }
