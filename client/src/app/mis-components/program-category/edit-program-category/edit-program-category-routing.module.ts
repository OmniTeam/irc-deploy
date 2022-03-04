import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EditProgramCategoryComponent} from "./edit-program-category.component";

const routes: Routes = [
  {
    path: '',
    component: EditProgramCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProgramCategoryRoutingModule { }
