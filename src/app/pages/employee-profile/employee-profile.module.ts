import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './employee-profile.routing';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Ng2LoadingSpinnerModule } from 'ng2-loading-spinner';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { datePrettyFormat } from '../../services/pipes/date-pretty-format.pipe';
import { EmployeeProfileComponent } from './employee-profile.component';
import { EmployeeOverviewComponent } from '../employee/employee-overview/employee-overview.component';
import { EmployeeMeetingsComponent } from '../employee/employee-meetings/employee-meetings.component';
import { EmployeeFeedbackComponent } from '../employee/employee-feedback/employee-feedback.component';

const MODULE_COMPONENTS = [
  EmployeeProfileComponent,
  EmployeeOverviewComponent,
  EmployeeMeetingsComponent,
  EmployeeFeedbackComponent
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
    SharedModule
  ],
  declarations: [
    ...MODULE_COMPONENTS,
    datePrettyFormat,
  ],
})

export class EmployeeProfileModule {}