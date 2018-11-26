import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { MeetingsComponent } from './meetings.component';
import { MeetingIndexComponent } from './meeting-index/meeting-index.component';
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';

export const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    children: [
      {path: '', component: MeetingIndexComponent},
      {path: ':id', component: MeetingDetailsComponent}
    ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

