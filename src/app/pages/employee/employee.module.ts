import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './employee.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EmployeeComponent } from './employee.component';

import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import {NgxPaginationModule} from 'ngx-pagination';
import { EmployeeOverviewComponent } from './employee-overview/employee-overview.component';

const MODULE_COMPONENTS = [
  EmployeeComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule,
    NgxPaginationModule,
    SharedModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    EmployeeOverviewComponent
  ],
})

export class EmployeeModule {}
