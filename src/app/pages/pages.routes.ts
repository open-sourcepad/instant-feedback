import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginComponent } from './login/login.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { PagesGuard } from './pages.guard';
import { RoleGuard } from './role.guard';
import { EmployeeMeetingDetailComponent } from './employee/employee-meeting-detail/employee-meeting-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'login', component: LoginComponent, canActivate: [PagesGuard]},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        canActivate: [RoleGuard],
        loadChildren: "./dashboard/dashboard.module#DashboardModule"
      },
      {
        path: 'responses',
        canActivate: [RoleGuard],
        loadChildren: "./responses/responses.module#ResponsesModule"
      },
      {
        path: 'questions',
        canActivate: [RoleGuard],
        loadChildren: "./questions/questions.module#QuestionsModule"
      },
      {
        path: 'one-on-ones',
        loadChildren: "./meetings/meetings.module#MeetingsModule"
      },
      { path: 'assigned-questions', component: UserQuestionsComponent, canActivate: [RoleGuard]},
      {
        path: 'employee',
        loadChildren: "./employee/employee.module#EmployeeModule"
      },
      { path: 'employee/one-on-ones/:id',component: EmployeeMeetingDetailComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
