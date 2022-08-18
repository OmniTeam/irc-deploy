import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StagingBeneficiaryListRoutingModule} from './staging-beneficiary-list-routing.module';
import {DataTablesModule} from 'angular-datatables';
import {StagingBeneficiaryListComponent} from './staging-beneficiary-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {EntityViewTableModule} from '../../../entity-views/entity-view-table/entity-view-table.module';


@NgModule({
  declarations: [StagingBeneficiaryListComponent],
    imports: [
        CommonModule,
        StagingBeneficiaryListRoutingModule,
        DataTablesModule,
        NgxDatatableModule,
        ReactiveFormsModule,
        NgSelectModule,
        EntityViewTableModule,
    ]
})
export class StagingBeneficiaryListModule {
}
