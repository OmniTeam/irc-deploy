import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StagingBeneficiaryListComponent} from "./staging-beneficiary-list.component";

const routes: Routes = [
  {
    path: '',
    component: StagingBeneficiaryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StagingBeneficiaryListRoutingModule {
}
