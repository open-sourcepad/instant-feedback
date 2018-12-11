import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { EmployeeComponent } from './employee.component';
import { EmployeeOverviewComponent } from './employee-overview/employee-overview.component';

export const routes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
      {path: 'overview', component: EmployeeOverviewComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

