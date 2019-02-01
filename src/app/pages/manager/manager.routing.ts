import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ManagerComponent } from './manager.component';
import { ManagerOverviewComponent } from './manager-overview/manager-overview.component';
import { ManagerMeetingsComponent } from './manager-meetings/manager-meetings.component';
import { ManagerFeedbackComponent } from './manager-feedback/manager-feedback.component';

export const routes: Routes = [
  {
    path: '',
    component: ManagerComponent,
    children: [
      {path: '', pathMatch: 'full', redirectTo: 'overview'},
      {path: 'overview', component: ManagerOverviewComponent},
      {path: 'one-on-ones', component: ManagerMeetingsComponent},
      {path: 'feedbacks', component: ManagerFeedbackComponent},
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
