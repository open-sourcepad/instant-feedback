import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { EmployeeProfileComponent } from './employee-profile.component';
import { EmployeeOverviewComponent } from '../employee/employee-overview/employee-overview.component';
import { EmployeeMeetingsComponent } from '../employee/employee-meetings/employee-meetings.component';
import { EmployeeFeedbackComponent } from '../employee/employee-feedback/employee-feedback.component';

export const routes: Routes = [
  {
    path: ':id',
    component: EmployeeProfileComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
      {path: 'overview', component: EmployeeOverviewComponent},
      {path: 'one-on-ones', component: EmployeeMeetingsComponent},
      {path: 'feedbacks', component: EmployeeFeedbackComponent},
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);