import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { EmployeeComponent } from './employee.component';
import { EmployeeOverviewComponent } from './employee-overview/employee-overview.component';
import { EmployeeMeetingsComponent } from './employee-meetings/employee-meetings.component';
import { EmployeeFeedbackComponent } from './employee-feedback/employee-feedback.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
      {path: 'overview', component: EmployeeOverviewComponent},
      {path: 'one-on-ones', component: EmployeeMeetingsComponent},
      {path: 'feedback', component: EmployeeFeedbackComponent},
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);