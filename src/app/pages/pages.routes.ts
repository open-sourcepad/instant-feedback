import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages.component';
import { LoginComponent } from './login/login.component';
import { UserQuestionsComponent } from './user-questions/user-questions.component';
import { PagesGuard } from './pages.guard';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'login', component: LoginComponent, canActivate: [PagesGuard]},
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: "./dashboard/dashboard.module#DashboardModule"
      },
      {
        path: 'responses',
        loadChildren: "./responses/responses.module#ResponsesModule"
      },
      {
        path: 'questions',
        loadChildren: "./questions/questions.module#QuestionsModule"
      },
      {
        path: 'one-on-ones',
        loadChildren: "./meetings/meetings.module#MeetingsModule"
      },
      { path: 'assigned-questions', component: UserQuestionsComponent},
      {
        path: 'employee',
        loadChildren: "./employee/employee.module#EmployeeModule"
      }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
