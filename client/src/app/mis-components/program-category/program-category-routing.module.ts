import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProgramCategoryComponent} from "./program-category.component";

const routes: Routes = [
  {
    path: '',
    component: ProgramCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramCategoryRoutingModule { }
