import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './dashboard.routing';

import { DashboardComponent } from './dashboard.component';

const MODULE_COMPONENTS = [
  DashboardComponent
]

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [
    ...MODULE_COMPONENTS
  ],
})

export class DashboardModule {}
