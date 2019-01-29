import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './employee-profile.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { EmployeeProfileComponent } from './employee-profile.component';
import { EmployeeModule } from '../employee/employee.module';

const MODULE_COMPONENTS = [
  EmployeeProfileComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    Daterangepicker,
    Ng2LoadingSpinnerModule,
    NgxPaginationModule,
    SharedModule,
    EmployeeModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
  ],
})

export class EmployeeProfileModule {}