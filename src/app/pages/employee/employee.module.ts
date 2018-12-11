import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './employee.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeComponent } from './employee.component';

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
    NgxPaginationModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    EmployeeOverviewComponent
  ],
})

export class EmployeeModule {}
