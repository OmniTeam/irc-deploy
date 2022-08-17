import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateProgramCategoryComponent} from "./create-program-category.component";

const routes: Routes = [
  {
    path: '',
    component: CreateProgramCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateProgramCategoryRoutingModule { }
