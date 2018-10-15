import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ResponsesComponent } from './responses.component';


export const routes: Routes = [
  {
    path: '',
    component: ResponsesComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);

