import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
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
      }
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
