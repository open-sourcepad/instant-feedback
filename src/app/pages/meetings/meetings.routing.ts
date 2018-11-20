import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { MeetingsComponent } from './meetings.component';

export const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent,
    // children: [
    // ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

